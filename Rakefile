require 'fileutils'
include FileUtils

ROOT = __dir__.freeze
BIN = "#{ROOT}/node_modules/.bin".freeze

def cmd_exists?(cmd)
  File.exists?(cmd) && File.executable?(cmd)
end

def ensure_cmd(cmd)
  $cmd_cache ||= []
  return true if $cmd_cache.include? cmd

  paths = ENV['PATH'].split(':').uniq
  unless paths.any?{|p| cmd_exists? "#{p}/#{cmd}" }
    raise "'#{cmd}' command doesn't exist"
  else
    $cmd_cache << cmd
  end
end

file 'node_modules' do
  ensure_cmd 'npm'
  sh 'npm install'
end

file 'bower_components' do
  ensure_cmd 'bower'
  sh 'bower install'
end

file "typings" do
  ensure_cmd 'tsd'
  sh 'tsd install'
end

task :dep => %i(node_modules bower_components typings)

task :build_browser_src => %i(typings) do
  sh "#{BIN}/tsc -p #{ROOT}/browser"
end

task :build_renderer_src do
  mkdir_p 'build/renderer'

  sh "#{BIN}/browserify -t babelify -d -o #{ROOT}/build/renderer/index.js ./renderer/index.jsx"
end

task :build => %i(dep build_browser_src build_renderer_src)

task :run do
  sh "#{ROOT}/bin/cli.js"
end

task :default => %i(build run)

task :asar do
  mkdir_p 'archive/resource'
  begin
    %w(bower.json package.json index.html style build).each{|p| cp_r p, 'archive/' }
    %w(emoji trayicon).each{|p| cp_r "resource/#{p}", 'archive/resource/'}
    cd 'archive' do
      sh 'npm install --production'
      sh 'bower install --production'
    end
    sh "#{BIN}/asar pack archive app.asar"
  ensure
    rm_rf 'archive'
  end
end

task :lint do
  Dir['browser/**/*.ts'].each do |f|
    sh "tslint #{f}"
  end
  Dir['renderer/**/*.js', 'renderer/**/*.jsx'].each do |f|
    sh "eslint #{f}"
  end
end

task :test do
  mkdir_p "#{ROOT}/tests/renderer/out"
  Dir["#{ROOT}/tests/renderer/*.js"].each do |p|
    js = File.basename p
    puts "TEST: #{js}"
    sh "#{BIN}/browserify -t babelify -o #{ROOT}/tests/renderer/out/#{js} #{p}"
    sh "#{BIN}/electron-mocha --renderer #{ROOT}/tests/renderer/out/#{js}"
  end
end
