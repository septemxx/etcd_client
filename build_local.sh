#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}ETCD Client Build Script${NC}"
echo "=========================="

# 检查是否安装了 Rust
if ! command -v cargo &> /dev/null; then
    echo -e "${RED}Error: Rust is not installed.${NC}"
    echo "Please install Rust via https://rustup.rs/"
    exit 1
fi

# 检查是否安装了 Node.js
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed.${NC}"
    echo "Please install Node.js first."
    exit 1
fi

# 安装依赖
echo -e "\n${YELLOW}Installing dependencies...${NC}"
npm install

# 构建 macOS 版本
echo -e "\n${YELLOW}Building for macOS...${NC}"
npm run tauri build

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}macOS build successful!${NC}"
    echo -e "Installer location: ${GREEN}src-tauri/target/release/bundle/dmg/${NC}"
    echo -e "App location: ${GREEN}src-tauri/target/release/bundle/macos/${NC}"
else
    echo -e "\n${RED}macOS build failed.${NC}"
    exit 1
fi

# 关于 Windows 构建的提示
echo -e "\n${YELLOW}Note regarding Windows build:${NC}"
echo "Building Windows executables (.exe/.msi) directly on macOS is complex and requires cross-compilation setup."
echo "The recommended way to build for Windows is using GitHub Actions."
echo "A workflow file has been created at: .github/workflows/release.yml"
echo "Simply push a tag starting with 'v' (e.g., v1.0.0) to trigger the multi-platform build."
