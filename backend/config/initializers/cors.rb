# Be sure to restart your server when you modify this file.

# Allow the Angular dev server (http://localhost:4200) to call this API.
# Tighten `origins` before deploying to production.
# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "http://localhost:4200"

    resource "*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ]
  end
end
