module Api
  class AuthController < ApplicationController
    def admin_login
      # Para desenvolvimento, vamos usar autenticação simples
      # Em produção, você deve implementar autenticação adequada
      user = User.find_by(email: params[:email])
      
      if user&.admin? && user.valid_password?(params[:password])
        render json: { 
          success: true, 
          token: user.id, # Token temporário
          user: {
            id: user.id,
            email: user.email,
            admin: user.admin
          }
        }
      else
        render json: { success: false, error: 'Credenciais inválidas' }, status: :unauthorized
      end
    end

    def admin_verify
      # Verificar se o token é válido
      user = User.find_by(id: params[:token])
      
      if user&.admin?
        render json: { 
          success: true, 
          user: {
            id: user.id,
            email: user.email,
            admin: user.admin
          }
        }
      else
        render json: { success: false, error: 'Token inválido' }, status: :unauthorized
      end
    end
  end
end 