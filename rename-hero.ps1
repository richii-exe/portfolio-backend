$i = 0
Get-ChildItem "public\hero\*.jpg" | Sort-Object Name | ForEach-Object {
    $newName = "frame_" + $i.ToString("D3") + ".jpg"
    Rename-Item $_.FullName -NewName $newName
    $i++
}
Write-Host "Renamed $i files"
