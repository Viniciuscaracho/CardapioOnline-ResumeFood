require 'thread'

BUFFER_SIZE = 5
NUM_PRODUTORES = 2
NUM_CONSUMIDORES = 2

$buffer = []
$count = 0

$mutex = Mutex.new

$buffer_full_condition = ConditionVariable.new

$buffer_empty_condition = ConditionVariable.new
def produtor(id)
  loop do
    item = rand(100)

    $mutex.synchronize do
      while $count == BUFFER_SIZE
        puts "Produtor #{id} aguardando: buffer cheio."
        $buffer_empty_condition.wait($mutex)
      end

      $buffer.push(item)
      $count += 1
      puts "Produtor #{id} produziu: #{item}. Buffer: #{$buffer.inspect} (count: #{$count})"

      $buffer_full_condition.signal
    end
    sleep(rand(3))
  end
end

def consumidor(id)
  loop do
    item = nil

    $mutex.synchronize do
      while $count == 0
        puts "Consumidor #{id} aguardando: buffer vazio."
        $buffer_full_condition.wait($mutex)
      end

      item = $buffer.pop
      $count -= 1
      puts "Consumidor #{id} consumiu: #{item}. Buffer: #{$buffer.inspect} (count: #{$count})"

      $buffer_empty_condition.signal
    end
    sleep(rand(3))
  end
end

produtores_threads = []
NUM_PRODUTORES.times do |i|
  produtores_threads << Thread.new { produtor(i + 1) }
end

consumidores_threads = []
NUM_CONSUMIDORES.times do |i|
  consumidores_threads << Thread.new { consumidor(i + 1) }
end

produtores_threads.each(&:join)
consumidores_threads.each(&:join)