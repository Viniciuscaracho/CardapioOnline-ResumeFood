require 'thread'

NUM_FILOSOFOS = 5

$garfos = Array.new(NUM_FILOSOFOS) { Mutex.new }
$mutex_global = Mutex.new

def filosofo(id)
  loop do
    puts "Filosofo #{id} esta pensando..."
    sleep(rand(3))
    $mutex_global.synchronize do
      $garfos[id].lock
      $garfos[(id + 1) % NUM_FILOSOFOS].lock

      puts "Filosofo #{id} esta comendo..."
      sleep(rand(3))

      # Libera o garfo esquerdo
      $garfos[id].unlock
      # Libera o garfo direito
      $garfos[(id + 1) % NUM_FILOSOFOS].unlock
    end
  end
end

filosofos = []
NUM_FILOSOFOS.times do |i|
  filosofos << Thread.new { filosofo(i) }
end

filosofos.each(&:join)