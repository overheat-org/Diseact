export PATH=$PATH:./node_modules/.bin

BABEL_ENV=cjs babel src --out-dir cjs
BABEL_ENV=esm babel src --out-dir esm

copyfiles -u 1 "src/**/*.d.ts" types