module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      # Para desenvolvimento, permitir conexões sem autenticação
      # Em produção, você deve implementar autenticação adequada
      if Rails.env.development?
        # Em desenvolvimento, criar um usuário admin fictício
        OpenStruct.new(id: 'admin', admin?: true)
      else
        token = request.params[:token]
        
        if token
          user = User.find_by(id: token)
          if user&.admin?
            user
          else
            reject_unauthorized_connection
          end
        else
          reject_unauthorized_connection
        end
      end
    end
  end
end
