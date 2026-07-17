class HelloController < ApplicationController
  def index
    render json: { message: "Hello, world from Rails!" }
  end
end
