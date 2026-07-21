#!/bin/bash

# 🖼️ Script de Compresión de Imágenes V2 - Sitio Web Titular
# Estrategia: Redimensionamiento inteligente para máxima reducción

echo "🖼️ INICIANDO COMPRESIÓN AGRESIVA DE IMÁGENES"
echo "============================================="

# Crear backup si no existe
if [ ! -d "figures_backup_v2" ]; then
    echo "📦 Creando backup de seguridad..."
    mkdir figures_backup_v2
    cp figures/*.png figures_backup_v2/ 2>/dev/null || true
    cp foto.png figures_backup_v2/ 2>/dev/null || true
    echo "✅ Backup creado en figures_backup_v2/"
fi

# Función mejorada de compresión
compress_smart() {
    local file="$1"
    local max_dimension="$2"
    local description="$3"
    
    if [ -f "$file" ]; then
        local before_size=$(ls -lah "$file" | awk '{print $5}')
        echo "🔧 Comprimiendo: $(basename "$file") (${before_size}) - $description"
        
        # Redimensionar manteniendo proporción
        sips -Z "$max_dimension" "$file" >/dev/null 2>&1
        
        local after_size=$(ls -lah "$file" | awk '{print $5}')
        echo "   ✅ Resultado: ${after_size} (era ${before_size})"
    fi
}

echo ""
echo "🎯 COMPRESIÓN INTELIGENTE POR CATEGORÍAS"
echo "========================================"

# 1. Imágenes más problemáticas - compresión máxima
echo "🔥 NIVEL 1: Imágenes más pesadas (redimensión a 1000px max)"
compress_smart "figures/placeholder-figura-6-3-2.png" 1000 "Figura académica"
compress_smart "figures/placeholder-figura-6-2-3.png" 1000 "Figura académica"
compress_smart "figures/image-3.png" 1200 "Imagen principal"

# 2. Imágenes de fondo - balance calidad/tamaño
echo ""
echo "🖼️ NIVEL 2: Imágenes de fondo (redimensión a 1600px max)"
compress_smart "figures/placeholder-uniandes-edificio.png" 1600 "Fondo edificio"
compress_smart "figures/placeholder-investigacion-bg.png" 1600 "Fondo investigación"
compress_smart "figures/teaching-hero-background.png" 1600 "Fondo docencia"
compress_smart "figures/profile-hero-background.png" 1600 "Fondo perfil"
compress_smart "figures/fondo_1.png" 1400 "Fondo general"
compress_smart "figures/placeholder-vision-bg.png" 1400 "Fondo visión"

# 3. Foto de perfil - alta calidad pero pequeña
echo ""
echo "👤 NIVEL 3: Foto de perfil (redimensión a 500px max)"
compress_smart "foto.png" 500 "Foto de perfil"

# 4. Thumbnails - tamaño pequeño
echo ""
echo "🎨 NIVEL 4: Thumbnails (redimensión a 300px max)"
compress_smart "figures/thumbnail-fisica-1.png" 300 "Thumbnail curso"
compress_smart "figures/thumbnail-intro-fisica.png" 300 "Thumbnail curso"
compress_smart "figures/thumbnail-ondas-fluidos.png" 300 "Thumbnail curso"

# 5. Figuras científicas - balance precisión/tamaño
echo ""
echo "📊 NIVEL 5: Figuras científicas (redimensión a 800px max)"
compress_smart "figures/placeholder-figura-5-2.png" 800 "Figura científica"
compress_smart "figures/placeholder-figura-6-3-1.png" 800 "Figura científica"

# 6. Gráficos pequeños - mantener legibilidad
echo ""
echo "📈 NIVEL 6: Gráficos pequeños (sin cambios)"
echo "   ℹ️  SGR.png y distribucion_sgr.png ya están optimizados (<100KB)"

echo ""
echo "📊 CALCULANDO RESULTADOS FINALES..."

# Calcular tamaños
total_before=0
total_after=0

for file in figures_backup_v2/*.png; do
    if [ -f "$file" ]; then
        size_bytes=$(stat -f%z "$file" 2>/dev/null || echo 0)
        total_before=$((total_before + size_bytes))
    fi
done

for file in figures/*.png foto.png; do
    if [ -f "$file" ]; then
        size_bytes=$(stat -f%z "$file" 2>/dev/null || echo 0)
        total_after=$((total_after + size_bytes))
    fi
done

# Convertir a MB
total_before_mb=$((total_before / 1024 / 1024))
total_after_mb=$((total_after / 1024 / 1024))
savings_mb=$((total_before_mb - total_after_mb))

if [ $total_before -gt 0 ]; then
    savings_percent=$(( (total_before - total_after) * 100 / total_before ))
else
    savings_percent=0
fi

echo ""
echo "🎉 RESULTADOS DE COMPRESIÓN AGRESIVA"
echo "===================================="
echo "📦 Tamaño original: ${total_before_mb}MB"
echo "⚡ Tamaño optimizado: ${total_after_mb}MB"
echo "💾 Ahorro total: ${savings_mb}MB"
echo "📈 Reducción: ${savings_percent}%"

if [ $savings_percent -gt 70 ]; then
    echo "🏆 ¡EXCELENTE! Optimización muy exitosa"
elif [ $savings_percent -gt 50 ]; then
    echo "✅ ¡MUY BUENO! Optimización exitosa"
elif [ $savings_percent -gt 30 ]; then
    echo "👍 BUENO: Optimización moderada"
else
    echo "⚠️  LIMITADO: Considera TinyPNG para más compresión"
fi

echo ""
echo "🔍 TOP 5 ARCHIVOS MÁS GRANDES RESTANTES:"
find figures/ -name "*.png" | xargs ls -lah | sort -k5 -hr | head -5

echo ""
echo "✅ COMPRESIÓN COMPLETADA"
echo ""
echo "🔧 VERIFICACIÓN RECOMENDADA:"
echo "1. 🌐 Abre index.html y verifica la calidad visual"
echo "2. 📱 Prueba en móvil - debería cargar mucho más rápido"
echo "3. 🔍 Si alguna imagen se ve pixelada, restaura desde figures_backup_v2/"
echo "4. 🚀 El sitio debería cargar 3-5x más rápido ahora"

# Limpiar archivos temporales
rm -f figures/test_resize.png figures/placeholder-figura-6-3-2_compressed.png 2>/dev/null || true