# Downloads the demo product photos into img\products for Shop Creator.
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$imageDir = Join-Path $root "img\products"
New-Item -ItemType Directory -Force -Path $imageDir | Out-Null

$images = @(
    @{ Name = "samsung-galaxy-watch6-44.jpg"; Url = "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "huawei-watch-fit-3.jpg"; Url = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "xiaomi-redmi-watch-5-lite.jpg"; Url = "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "xiaomi-smart-band-9.jpg"; Url = "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "amazfit-bip-5.jpg"; Url = "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "haylou-solar-neo.jpg"; Url = "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "modyo-st12.jpg"; Url = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "skmei-1838.jpg"; Url = "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "g9-ultra-pro.jpg"; Url = "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "alain-delon-ad354-1546.jpg"; Url = "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "anker-soundcore-r50i.jpg"; Url = "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "anker-soundcore-r50i-nc.jpg"; Url = "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "air40-sound.jpg"; Url = "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "p47-wireless-headphones.jpg"; Url = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "samsung-galaxy-buds4-pro.jpg"; Url = "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "apple-airpods-pro-3.jpg"; Url = "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "jbl-clip-5.jpg"; Url = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "jbl-go-4.jpg"; Url = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "xiaomi-sound-pocket.jpg"; Url = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "m3-portable-speaker.jpg"; Url = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "jbl-flip-7.jpg"; Url = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "xiaomi-sound-outdoor.jpg"; Url = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "baseus-20w-charger.jpg"; Url = "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "power-bank-20000.jpg"; Url = "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "braided-usb-c-cable.jpg"; Url = "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "everyday-tech-pouch.jpg"; Url = "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "laptop-sleeve-14.jpg"; Url = "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "foldable-phone-stand.jpg"; Url = "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "wireless-charging-pad.jpg"; Url = "https://images.unsplash.com/photo-1591290619762-c588a4e2a9c5?auto=format&fit=crop&w=900&q=85" },
    @{ Name = "compact-everyday-backpack.jpg"; Url = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85" }
)

$ok = 0
foreach ($item in $images) {
    $target = Join-Path $imageDir $item.Name
    try {
        Invoke-WebRequest -Uri $item.Url -OutFile $target -Headers @{ "User-Agent" = "Mozilla/5.0" } -TimeoutSec 30
        if ((Get-Item $target).Length -gt 1000) {
            Write-Host ("OK   " + $item.Name) -ForegroundColor Green
            $ok++
        } else {
            Remove-Item $target -ErrorAction SilentlyContinue
            Write-Host ("FAIL " + $item.Name + " (download too small)") -ForegroundColor Red
        }
    } catch {
        Remove-Item $target -ErrorAction SilentlyContinue
        Write-Host ("FAIL " + $item.Name + " — " + $_.Exception.Message) -ForegroundColor Red
    }
}
Write-Host ""
Write-Host ("Downloaded " + $ok + " of " + $images.Count + " images.")
Write-Host "These are generic demo photos, not verified official photos for every exact product model."
