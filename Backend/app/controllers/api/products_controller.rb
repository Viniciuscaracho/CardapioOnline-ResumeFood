module Api
  class ProductsController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_product, only: [:show, :update, :destroy]

      def index
    products = Product.all
    render json: products.as_json(only: [:id, :name, :description, :price, :category, :available, :image_url])
  end

    def show
      render json: @product.as_json(only: [:id, :name, :description, :price, :category, :available])
    end

    def create
      @product = Product.new(product_params)
      attach_image_from_base64(@product)
      
      if @product.save
        render json: @product, serializer: ProductSerializer, status: :created
      else
        render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      if @product.update(product_params)
        attach_image_from_base64(@product)
        render json: @product, serializer: ProductSerializer
      else
        render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @product.destroy
      head :no_content
    end

    private

    def set_product
      @product = Product.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Produto não encontrado' }, status: :not_found
    end

    def product_params
      params.require(:product).permit(:name, :description, :price, :category, :available)
    end

    def attach_image_from_base64(product)
      base64 = params[:product][:image_base64]
      return unless base64.present?
      content_type = base64[%r{data:(.*?);base64}, 1] || 'image/png'
      data = Base64.decode64(base64.split(',')[1])
      product.image.attach(io: StringIO.new(data), filename: "product-#{Time.now.to_i}.#{content_type.split('/').last}", content_type: content_type)
    end
  end
end 