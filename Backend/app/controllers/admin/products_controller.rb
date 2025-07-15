class Admin::ProductsController < AdminController
  before_action :set_product, only: [:show, :edit, :update, :destroy]

  def index
    @products = Product.all.order(created_at: :desc)
  end

  def show
  end

  def new
    @product = Product.new
  end

  def create
    @product = Product.new(product_params)
    
    if @product.save
      redirect_to admin_products_path, notice: 'Produto criado com sucesso!'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @product.update(product_params)
      redirect_to admin_products_path, notice: 'Produto atualizado com sucesso!'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @product.destroy
    redirect_to admin_products_path, notice: 'Produto removido com sucesso!'
  end

  private

  def set_product
    @product = Product.find(params[:id])
  end

  def product_params
    params.require(:product).permit(:name, :description, :price, :category, :image_url, :available)
  end
end 