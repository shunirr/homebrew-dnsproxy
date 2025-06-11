
# typed: false
# frozen_string_literal: true

class Dnsproxy < Formula
  desc ""
  homepage "https://github.com/AdguardTeam/dnsproxy"
  version "v0.75.6"
  depends_on :macos

  if Hardware::CPU.intel?
    url "https://github.com/AdguardTeam/dnsproxy/releases/download/v0.75.6/dnsproxy-darwin-amd64-v0.75.6.tar.gz"

    def install
      bin.install "dnsproxy"
    end
  end
  if Hardware::CPU.arm?
    url "https://github.com/AdguardTeam/dnsproxy/releases/download/v0.75.6/dnsproxy-darwin-arm64-v0.75.6.tar.gz"

    def install
      bin.install "dnsproxy"
    end
  end
end
