import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ImageError, toThumbnailDataUrl } from '../image';
import { Tool, TOOL_CATEGORIES, emptyTool } from '../tool';
import { ToolService } from '../tool.service';

@Component({
  selector: 'app-tools',
  imports: [FormsModule],
  templateUrl: './tools.html',
  styleUrl: './tools.css'
})
export class Tools implements OnInit {
  private readonly toolService = inject(ToolService);

  protected readonly categories = TOOL_CATEGORIES;
  protected readonly tools = signal<Tool[]>([]);
  protected readonly form = signal<Tool>(emptyTool());
  protected readonly editingId = signal<number | null>(null);
  protected readonly errors = signal<string[]>([]);
  protected readonly loading = signal(true);
  /** True while a chosen photo is being downscaled. */
  protected readonly processingImage = signal(false);
  /** Tool whose photo is open in the lightbox, if any. */
  protected readonly viewing = signal<Tool | null>(null);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.toolService.list().subscribe({
      next: (tools) => {
        this.tools.set(tools);
        this.loading.set(false);
      },
      error: () => {
        this.errors.set(['Could not reach the Rails backend.']);
        this.loading.set(false);
      }
    });
  }

  protected save(): void {
    this.errors.set([]);
    const payload = this.form();
    const id = this.editingId();
    const request = id === null
      ? this.toolService.create(payload)
      : this.toolService.update(id, payload);

    request.subscribe({
      next: () => {
        this.resetForm();
        this.load();
      },
      error: (err) => this.errors.set(err?.error?.errors ?? ['Something went wrong.'])
    });
  }

  protected edit(tool: Tool): void {
    this.editingId.set(tool.id ?? null);
    this.form.set({ ...tool });
    this.errors.set([]);
  }

  protected remove(tool: Tool): void {
    if (tool.id === undefined) {
      return;
    }
    if (!confirm(`Delete "${tool.name}"?`)) {
      return;
    }
    this.toolService.delete(tool.id).subscribe({
      next: () => {
        if (this.editingId() === tool.id) {
          this.resetForm();
        }
        if (this.viewing()?.id === tool.id) {
          this.closeImage();
        }
        this.load();
      },
      error: () => this.errors.set(['Could not delete the tool.'])
    });
  }

  protected cancelEdit(): void {
    this.resetForm();
  }

  /** Downscales the chosen photo and attaches it to the form. */
  protected pickImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.processingImage.set(true);
    toThumbnailDataUrl(file)
      .then((image) => {
        this.form.set({ ...this.form(), image });
        this.errors.set([]);
      })
      .catch((err) => {
        this.errors.set([err instanceof ImageError ? err.message : 'Could not add that photo.']);
      })
      .finally(() => {
        this.processingImage.set(false);
        input.value = '';
      });
  }

  /** Drops the photo from the form; saving then clears it on the tool. */
  protected clearImage(): void {
    this.form.set({ ...this.form(), image: null });
  }

  protected viewImage(tool: Tool): void {
    this.viewing.set(tool);
  }

  /** Escape closes the lightbox, which is not itself focused. */
  @HostListener('document:keydown.escape')
  protected closeImage(): void {
    this.viewing.set(null);
  }

  /** Downloads the whole inventory as a JSON file. */
  protected exportInventory(): void {
    const data = JSON.stringify(this.toolService.exportAll(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tool-inventory-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /** Replaces the inventory with the contents of an uploaded JSON export. */
  protected importInventory(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        this.toolService.replaceAll(JSON.parse(reader.result as string));
        this.resetForm();
        this.load();
      } catch {
        this.errors.set(['That file is not a valid inventory export.']);
      }
      input.value = '';
    };
    reader.readAsText(file);
  }

  private resetForm(): void {
    this.editingId.set(null);
    this.form.set(emptyTool());
    this.errors.set([]);
  }
}
