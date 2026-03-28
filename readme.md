# snippet - Code Snippet Management Tool

A CLI tool for saving, managing, and sharing code snippets.

## 🚀 Features

- ✅ Local code snippet saving (auto-scanning directories, extracting dependencies)
- ✅ Interactive command-line interface
- ✅ Snippet search (by title, description, tags, framework, database)
- ✅ Snippet metadata management (title, description, tags)
- ✅ Project isolation (each project's snippets are saved independently)
- ✅ Automatic Token generation (automatically generated on first use, no manual configuration needed)
- ✅ Upload/Share snippets to server
- ✅ List snippets on server
- ✅ Delete snippets from server
- ✅ Download snippets from server
- ✅ Install snippets to current project

- Contact me: wonkmy@gmail.com
- Github: https://github.com/Wonkmy/snipshare-cli.git

## 📦 Installation

```bash
npm install -g snipshare-cli
```

## 🛠️ Usage

### First Use

After installation, run any command to automatically generate a Token:

```bash
snippet hello
```

### Help

```bash
snippet --help
```

### Version

```bash
snippet -v
```

### Configuration

#### View Current Configuration

```bash
snippet config get
```

#### Set Configuration

```bash
snippet config set <key> <value>
```

Supported configuration items:

- `server` - Server address (default: none - you need to deploy your own server)
- `token` - Authentication Token (automatically generated on first use, no manual configuration needed)

**Note**: Token is automatically generated in `~/.snippet/config.json` with format `user_` + random string. A new Token is generated each time the tool is reinstalled.

**Server Deployment Required**: Remote features (publish, download, etc.) require a server. To use these features:

1. Deploy your own server (see [Server Deployment](#server-deployment))
2. Configure the client:

```bash
snippet config set server http://your-server:3000
```

**Reset Configuration**: To reset all configuration to default values:

```bash
snippet config reset
```

### Save Code Snippet

```bash
snippet save <directory>
```

**Examples**:

```bash
# Save snippets from current directory
snippet save .

# Save snippets from specific directory
snippet save ./my-project
```

After running, you will be prompted to enter:

1. Snippet name (default is directory name)
2. Description
3. Framework (Express/NestJS/Koa/Fastify/Other)
4. Database (MongoDB/MySQL/PostgreSQL/SQLite/No Database)
5. Tags (comma-separated)

**Saved content**:

- All source code files (auto-scanned, **node_modules folder is automatically ignored**)
- Dependencies from package.json
- Snippet metadata (title, description, framework, database, tags)

**Save location**: `current directory/snippets/`

### List All Snippets

```bash
snippet list
```

Displays basic information for all snippets:

- ID
- Name
- Description
- Framework and Database
- Tags
- Creation Time
- File Count

### View Snippet Details

```bash
snippet view <id>
```

**Example**:

```bash
snippet view mn76p6qcdckni
```

Displays detailed information including all files.

### Update Snippet Metadata

```bash
snippet update <id>
```

**Example**:

```bash
snippet update mn76p6qcdckni
```

After running, you will be prompted to enter:

1. New title (default is current title)
2. New description (default is current description)
3. New tags (default is current tags)

### Delete Snippet

```bash
snippet delete <id>
```

**Example**:

```bash
snippet delete mn76p6qcdckni
```

### Search Snippets

```bash
snippet search <keyword>
```

**Examples**:

```bash
# Search for snippets containing "express"
snippet search express

# Search for snippets containing "mongodb"
snippet search mongodb

# Search for snippets containing "authentication"
snippet search authentication
```

**Search scope**:

- Title
- Description
- Tags
- Framework
- Database

Case-insensitive matching.

### Upload Snippet to Server

```bash
snippet publish
```

After running, it will:

1. List all local snippets
2. Select snippet to upload
3. Display snippet details (name, description, framework, database, tags, file count, dependency count)
4. Confirm upload

**Upload requirements**:
- Official address: `https://snipshare.dxstudio.site`
- Server address must be configured first: `snippet config set server <server address>`
- Token is automatically included in request headers (format: `Authorization: Bearer <token>`)

### List Server Snippets

```bash
snippet list-remote
```

Displays basic information for all server snippets:

- ID
- Name
- Description
- Framework and Database
- Tags
- Creation Time
- File Count

### Delete Server Snippet

```bash
snippet delete-remote <id>
```

**Example**:

```bash
snippet delete-remote mn76p6qcdckni
```

### Download Snippet from Server

```bash
snippet download
```

After running, it will:

1. List all server snippets
2. Select snippet to download
3. Prompt for save directory

### List Downloaded Snippets

```bash
snippet list-downloaded
```

### Install Snippet to Current Project

```bash
snippet install <id>
```

After running, it will:

1. Prompt for installation directory (default is current project)

### Uninstall Snippet

```bash
snippet uninstall <id>
```

**Example**:

```bash
snippet uninstall mn76p6qcdckni
```

## 📝 Notes

- Snippets are saved in the `snippets/` folder in the current working directory
- `node_modules` folder is automatically ignored
- Snippet ID is an automatically generated unique identifier
- `updatedAt` timestamp is automatically updated when snippet metadata is modified
- Token is stored in `~/.snippet/config.json` with format `user_` + random string
- Reinstalling the tool generates a new Token (because `~/.snippet` directory is deleted)

## 🖥️ Server Deployment

### Deploy Official Server

The official server is hosted at `https://snipshare.dxstudio.site`. Remote features (publish, download, etc.) require a server.

To deploy your own server:

1. Clone or copy the `snippet-server` folder to your server
2. Install dependencies:

```bash
cd snippet-server
npm install
```

3. Create `.env` file:

```bash
cp .env.example .env
```

4. Edit `.env`:

```env
PORT=3000
DATA_DIR=./data
```

5. Start the server:

```bash
npm start
```

Your server will be available at `http://your-server:3000`.

### Configure Client

After deploying your server, configure the client:

```bash
snippet config set server http://your-server:3000
```

## ✅ Completed Features

### Phase 1: Local Management
- ✅ save command (save code snippet)
- ✅ list command (list all snippets)
- ✅ view command (view snippet details)
- ✅ update command (update snippet metadata)
- ✅ delete command (delete snippet)
- ✅ search command (search snippets)

### Phase 2: Remote Management
- ✅ publish command (upload snippet to server)
- ✅ list-remote command (list server snippets)
- ✅ delete-remote command (delete server snippet)
- ✅ Automatic token generation

### Phase 3: Download/Install
- ✅ download command (download snippet from server)
- ✅ install command (install snippet to current project)
- ✅ list-downloaded command (list downloaded snippets)
- ✅ uninstall command (uninstall snippet)

## 📄 License

MIT
