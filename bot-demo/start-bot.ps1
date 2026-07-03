$choice = Read-Host "═══════════════════════════════════════`n  CONNEXION WHATSAPP`n`n  1  QR code`n  2  Code d'appairage`n`n  Choix (1 ou 2)"
if ($choice -eq "2") {
    $phone = Read-Host "`n  Numero du bot (indicatif inclus)"
    $env:BOT_PHONE_NUMBER = $phone
}
$env:BOT_CHOICE = $choice
npx tsx src/index.ts
