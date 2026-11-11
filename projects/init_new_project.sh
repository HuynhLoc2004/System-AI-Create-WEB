#!/bin/bash
set -e

PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]; then
  echo "❌ Lỗi: Vui lòng cung cấp tên dự án. Ví dụ: ./init_new_project.sh my_ecommerce"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_PATH="$SCRIPT_DIR/_project_template"
DEST_PATH="$SCRIPT_DIR/$PROJECT_NAME"

if [ -d "$DEST_PATH" ]; then
  echo "❌ Lỗi: Dự án '$PROJECT_NAME' đã tồn tại!"
  exit 1
fi

echo "🚀 Đang khởi tạo không gian dự án mới: '$PROJECT_NAME'..."
cp -r "$SOURCE_PATH" "$DEST_PATH"

echo "✅ KHỞI TẠO DỰ ÁN THÀNH CÔNG tại: $DEST_PATH"

