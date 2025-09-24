module Api
  class TestController < ApplicationController
    skip_before_action :verify_authenticity_token
    
    def index
      render plain: "API funcionando - #{Time.current}"
    end
  end
end 