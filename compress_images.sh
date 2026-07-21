#!/bin/bash

# 🖼️ Script de Compresión de Imágenes - Sitio Web Titular
# Autor: Claude Code Assistant
# Fecha: $(date)

echo "🖼️ INICIANDO OPTIMIZACIÓN DE IMÁGENES DEL SITIO WEB"
echo "=================================================="

# Verificar que estamos en el directorio correcto
if [ ! -d "figures" ]; then
    echo "❌ Error: No se encuentra la carpeta 'figures'. Ejecuta este script desde la raíz del sitio."
    exit 1
fi

# Crear backup de seguridad
echo "📦 Creando backup de seguridad..."
if [ ! -d "figures_backup" ]; then
    mkdir figures_backup
    cp figures/*.png figures_backup/ 2>/dev/null || true
    cp figures/*.jpg figures_backup/ 2>/dev/null || true
    cp foto.png figures_backup/ 2>/dev/null || true
    echo "✅ Backup creado en figures_backup/"
else
    echo "⚠️  Backup ya existe, continuando..."
fi

# Función para mostrar tamaño de archivo
get_size() {
    ls -lah "$1" | awk '{print $5}'
}

# Función para comprimir con sips (nativo macOS)
compress_image() {
    local file="$1"
    local max_size="$2"
    local quality="$3"
    
    if [ -f "$file" ]; then
        local before_size=$(get_size "$file")
        echo "📸 Comprimiendo: $(basename "$file") (${before_size})"
        
        # Redimensionar y comprimir
        sips -Z "$max_size" --setProperty quality "$quality" "$file" >/dev/null 2>&1
        
        local after_size=$(get_size "$file")
        echo "   ✅ Resultado: ${after_size} (era ${before_size})"
    fi
}

echo ""
echo "🎯 COMPRIMIENDO IMÁGENES CRÍTICAS..."
echo "======================================="

# Imágenes más pesadas - compresión agresiva
echo "🔥 Procesando imágenes más pesadas..."
compress_image "figures/placeholder-figura-6-3-2.png" 1200 0.7
compress_image "figures/placeholder-figura-6-2-3.png" 1200 0.7
compress_image "figures/image-3.png" 1000 0.75

# Imágenes de fondo - mantener calidad pero reducir tamaño
echo "🖼️  Procesando imágenes de fondo..."
compress_image "figures/placeholder-uniandes-edificio.png" 1920 0.8
compress_image "figures/placeholder-investigacion-bg.png" 1920 0.8
compress_image "figures/teaching-hero-background.png" 1920 0.8
compress_image "figures/profile-hero-background.png" 1920 0.8
compress_image "figures/fondo_1.png" 1600 0.8
compress_image "figures/placeholder-vision-bg.png" 1600 0.8

# Foto de perfil - calidad alta pero tamaño pequeño
echo "👤 Procesando foto de perfil..."
compress_image "foto.png" 600 0.85

# Thumbnails - tamaño pequeño
echo "🎨 Procesando thumbnails..."
compress_image "figures/thumbnail-fisica-1.png" 400 0.8
compress_image "figures/thumbnail-intro-fisica.png" 400 0.8
compress_image "figures/thumbnail-ondas-fluidos.png" 400 0.8

# Figuras y diagramas
echo "📊 Procesando figuras y diagramas..."
compress_image "figures/placeholder-figura-5-2.png" 800 0.8
compress_image "figures/placeholder-figura-6-3-1.png" 800 0.8

echo ""
echo "📊 RESUMEN DE OPTIMIZACIÓN"
echo "=========================="

# Calcular tamaños totales
total_before=0
total_after=0

echo "📁 Calculando tamaños..."
for file in figures/*.png figures/*.jpg foto.png; do
    if [ -f "$file" ]; then
        size_bytes=$(stat -f%z "$file" 2>/dev/null || echo 0)
        total_after=$((total_after + size_bytes))
    fi
done

if [ -d "figures_backup" ]; then
    for file in figures_backup/*.png figures_backup/*.jpg; do
        if [ -f "$file" ]; then
            size_bytes=$(stat -f%z "$file" 2>/dev/null || echo 0)
            total_before=$((total_before + size_bytes))
        fi
    done
fi

# Convertir a MB para mostrar
total_before_mb=$((total_before / 1024 / 1024))
total_after_mb=$((total_after / 1024 / 1024))
savings_mb=$((total_before_mb - total_after_mb))
if [ $total_before -gt 0 ]; then
    savings_percent=$(( (total_before - total_after) * 100 / total_before ))
else
    savings_percent=0
fi

echo ""
echo "📈 RESULTADOS:"
echo "   📦 Tamaño original: ${total_before_mb}MB"
echo "   ⚡ Tamaño optimizado: ${total_after_mb}MB"
echo "   💾 Ahorro: ${savings_mb}MB (${savings_percent}%)"

if [ $savings_percent -gt 50 ]; then
    echo "   🎉 ¡Excelente optimización!"
elif [ $savings_percent -gt 30 ]; then
    echo "   ✅ Buena optimización"
else
    echo "   ⚠️  Optimización moderada"
fi

echo ""
echo "🔧 PRÓXIMOS PASOS RECOMENDADOS:"
echo "================================"
echo "1. 🌐 Abre el sitio web y verifica que las imágenes se ven bien"
echo "2. 📱 Prueba la velocidad de carga en móvil"
echo "3. 🔍 Si alguna imagen se ve mal, reemplázala desde figures_backup/"
echo "4. 🚀 Para optimización avanzada, considera convertir a WebP"
echo ""
echo "✅ OPTIMIZACIÓN COMPLETADA"

# Mostrar archivos más grandes restantes
echo ""
echo "📋 Archivos más grandes restantes:"
find figures/ -name "*.png" -o -name "*.jpg" | xargs ls -lah | sort -k5 -hr | head -5

echo ""
echo "💡 TIP: Para optimización adicional, usa https://tinypng.com/ con los archivos más grandes."