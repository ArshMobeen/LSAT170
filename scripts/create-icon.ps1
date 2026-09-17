Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$out = Join-Path $root 'build'
New-Item -ItemType Directory -Path $out -Force | Out-Null
$bitmap = New-Object System.Drawing.Bitmap(1024,1024)
$g = [System.Drawing.Graphics]::FromImage($bitmap)
$g.SmoothingMode = 'AntiAlias'
$g.Clear([System.Drawing.Color]::Transparent)
$shape = New-Object System.Drawing.Drawing2D.GraphicsPath
$shape.AddArc(48,48,340,340,180,90)
$shape.AddArc(636,48,340,340,270,90)
$shape.AddArc(636,636,340,340,0,90)
$shape.AddArc(48,636,340,340,90,90)
$shape.CloseFigure()
$bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush([System.Drawing.Point]::new(100,70),[System.Drawing.Point]::new(900,950),[System.Drawing.ColorTranslator]::FromHtml('#263f5e'),[System.Drawing.ColorTranslator]::FromHtml('#060d1b'))
$g.FillPath($bg,$shape)
$edge = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(100,161,188,219),2)
$g.DrawPath($edge,$shape)
$glyph = New-Object System.Drawing.Drawing2D.GraphicsPath
$font = New-Object System.Drawing.FontFamily('Georgia')
$glyph.AddString('a',$font,[int][System.Drawing.FontStyle]::Italic,760,[System.Drawing.PointF]::new(0,0),[System.Drawing.StringFormat]::GenericTypographic)
$bounds = $glyph.GetBounds()
$transform = New-Object System.Drawing.Drawing2D.Matrix
$transform.Translate(304-$bounds.X,290-$bounds.Y)
$glyph.Transform($transform)
$silver = New-Object System.Drawing.Drawing2D.LinearGradientBrush([System.Drawing.Point]::new(350,270),[System.Drawing.Point]::new(650,780),[System.Drawing.ColorTranslator]::FromHtml('#f4f2ec'),[System.Drawing.ColorTranslator]::FromHtml('#8da4c2'))
$g.FillPath($silver,$glyph)
$star = New-Object System.Drawing.Drawing2D.GraphicsPath
$star.AddPolygon([System.Drawing.PointF[]]@([System.Drawing.PointF]::new(686,181),[System.Drawing.PointF]::new(704,221),[System.Drawing.PointF]::new(744,239),[System.Drawing.PointF]::new(704,257),[System.Drawing.PointF]::new(686,297),[System.Drawing.PointF]::new(668,257),[System.Drawing.PointF]::new(628,239),[System.Drawing.PointF]::new(668,221)))
$g.FillPath($silver,$star)
$numberFont = New-Object System.Drawing.Font('Georgia',44,[System.Drawing.FontStyle]::Regular,[System.Drawing.GraphicsUnit]::Pixel)
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = 'Center'
$g.DrawString('1 7 0',$numberFont,$silver,[System.Drawing.PointF]::new(516,824),$sf)
$bitmap.Save((Join-Path $out 'icon.png'),[System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bitmap.Dispose(); $shape.Dispose(); $glyph.Dispose(); $star.Dispose(); $silver.Dispose(); $bg.Dispose(); $edge.Dispose(); $font.Dispose(); $numberFont.Dispose(); $sf.Dispose(); $transform.Dispose()
Write-Output 'Created build/icon.png (1024 x 1024)'
