class ToolsController < ApplicationController
  before_action :set_tool, only: %i[show update destroy]

  # GET /api/tools
  def index
    render json: Tool.ordered
  end

  # GET /api/tools/:id
  def show
    render json: @tool
  end

  # POST /api/tools
  def create
    tool = Tool.new(tool_params)
    if tool.save
      render json: tool, status: :created
    else
      render json: { errors: tool.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/tools/:id
  def update
    if @tool.update(tool_params)
      render json: @tool
    else
      render json: { errors: @tool.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/tools/:id
  def destroy
    @tool.destroy
    head :no_content
  end

  private

  def set_tool
    @tool = Tool.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { errors: [ "Tool not found" ] }, status: :not_found
  end

  def tool_params
    params.require(:tool).permit(:name, :category, :brand, :model, :quantity, :location)
  end
end
