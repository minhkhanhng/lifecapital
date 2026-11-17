#!/usr/bin/env bash
# In nhánh, worktree, commit chưa push, thay đổi dở. Chỉ đọc, không đổi gì. Không gọi mạng.
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1
echo "== Nhánh hiện tại"; git branch --show-current
echo "== Worktree"; git worktree list
echo "== Thay đổi chưa commit"; git status --short | head -20; [ -z "$(git status --short)" ] && echo "(sạch)"
echo "== Commit chưa push (so với origin/main)"; git log --oneline origin/main..HEAD 2>/dev/null | head -20
echo "== Nhánh claude/*"; git branch --list 'claude/*'
echo "== Phiên bản trong mã"
grep -o 'APPV = [0-9]*; // v[0-9.]*' index.html | head -1
grep -o 'VERSION = "[^"]*"' sw.js | head -1
echo "== Cổng 8765/8790 (cổng 8765 thuộc dự án khác)"; lsof -nP -iTCP:8765 -iTCP:8790 -sTCP:LISTEN 2>/dev/null | tail -n +1
df -h . | tail -1
