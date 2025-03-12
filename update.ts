const DNSPROXY_RELEASES =
  'https://api.github.com/repos/AdguardTeam/dnsproxy/releases/latest'

const FORMULA_TEMPLATE = `
# typed: false
# frozen_string_literal: true

class Dnsproxy < Formula
    desc ""
    homepage "https://github.com/AdguardTeam/dnsproxy"
    version "{{VERSION}}"
    depends_on :macos
  
    if Hardware::CPU.intel?
      url "{{AMD64_URL}}"
  
      def install
        bin.install "dnsproxy"
      end
    end
    if Hardware::CPU.arm?
      url "{{ARM64_URL}}"
  
      def install
        bin.install "dnsproxy"
      end
    end
  end
end
`
async function getCurrentVersion(): Promise<string> {
  return (await Deno.readTextFile('current-version')).trim()
}

async function writeCurrentVersion(version: string) {
  await Deno.writeTextFile('current-version', version)
}

async function writeNewFormula(args: {
  amd64Link: string
  arm64Link: string
  version: string
}) {
  const formula = FORMULA_TEMPLATE.replaceAll('{{VERSION}}', args.version)
    .replaceAll('{{AMD64_URL}}', args.amd64Link)
    .replaceAll('{{ARM64_URL}}', args.arm64Link)

  await Deno.writeTextFile('dnsproxy.rb', formula)
}

async function main() {
  const currentVersion = await getCurrentVersion()

  const json = await (await fetch(DNSPROXY_RELEASES)).json()
  const newVersion = json.tag_name

  if (currentVersion === newVersion) {
    console.log('No update available')
    return
  }

  console.log('Detect new version:' + newVersion)

  const amd64 = json.assets.find((assets: { name: string }) =>
    assets.name.includes('darwin-amd64')
  )
  const arm64 = json.assets.find((assets: { name: string }) =>
    assets.name.includes('darwin-arm64')
  )

  if (!amd64 || !arm64) {
    throw new Error('Failed to extract amd64 or arm64 download link')
  }

  const options = {
    amd64Link: amd64.browser_download_url,
    arm64Link: arm64.browser_download_url,
    version: newVersion,
  }
  console.log('Write new formula: ', options)
  await writeNewFormula(options)
  await writeCurrentVersion(newVersion)
  console.log('Complete write new formula')
}

main()
