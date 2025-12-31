# Running Jovian Tech Labs Locally

## Prerequisites

1. **Install Ruby** (if not already installed)
   - Download from: https://rubyinstaller.org/
   - Choose Ruby+Devkit version (recommended)
   - During installation, check "Add Ruby executables to your PATH"

2. **Verify Ruby installation**
   ```powershell
   ruby --version
   ```

## Setup Steps

### 1. Install Bundler (if not installed)
```powershell
gem install bundler
```

### 2. Install Jekyll and dependencies
```powershell
bundle install
```

This will install all gems specified in your `Gemfile`, including Jekyll.

### 3. Run the Jekyll server
```powershell
bundle exec jekyll serve
```

Or simply:
```powershell
bundle exec jekyll s
```

## Access Your Site

Once the server starts, you'll see output like:
```
Server address: http://127.0.0.1:4000/
Server running... press ctrl-c to stop.
```

Open your browser and navigate to: **http://localhost:4000**

## Useful Commands

- **Start server with auto-reload**: `bundle exec jekyll serve --livereload`
- **Build site only** (no server): `bundle exec jekyll build`
- **Build with drafts**: `bundle exec jekyll serve --drafts`
- **Stop server**: Press `Ctrl+C` in the terminal

## Troubleshooting

### If you get "bundle: command not found"
- Make sure Ruby is installed and in your PATH
- Try: `gem install bundler`

### If you get permission errors
- On Windows, you might need to run PowerShell as Administrator
- Or install gems to user directory: `gem install bundler --user-install`

### If port 4000 is already in use
- Use a different port: `bundle exec jekyll serve --port 4001`

### If you see "Liquid syntax errors"
- Check your `_config.yml` for YAML syntax errors
- Make sure all includes are properly formatted

## Development Tips

- The site auto-rebuilds when you save changes to files
- CSS and JS changes may require a hard refresh (Ctrl+F5) in the browser
- Check the terminal for any build errors
- The `_site` folder contains the built site (don't edit directly)

