# 🔧 Git Commands Reference

*Essential Git commands for developers - from beginner to professional*

---

## 🔹 Git vs GitHub (Quick Overview)
**🔧 Git** → Version control tool (runs locally on your system)  
**🐙 GitHub** → Cloud platform to host and share Git repositories

---

## 🔹 BASIC SETUP COMMANDS

### 1️⃣ Check Git version
```bash
git --version
```
*Verify Git installation and current version*

### 2️⃣ Configure username & email (one-time setup)
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```
**✅ Verify configuration:**
```bash
git config --list
```
*This identifies you in all commits*

---

## 🔹 REPOSITORY COMMANDS

### 3️⃣ Initialize a new repository
```bash
git init
```
*Creates .git folder (hidden) - turns any folder into a Git repository*

### 4️⃣ Clone an existing repository
```bash
git clone https://github.com/user/repo.git
```
*Downloads complete repository with full history*

---

## 🔹 FILE & STATUS COMMANDS

### 5️⃣ Check status (⭐ MOST IMPORTANT)
```bash
git status
```
**📊 Shows:**
- 🔴 Modified files (changed but not staged)
- 🟢 Staged files (ready to commit)
- ⚪ Untracked files (new files Git doesn't know about)

### 6️⃣ Add files to staging area
**Add specific file:**
```bash
git add index.html
```
**Add all changes:**
```bash
git add .
```
*Staging prepares files for commit*

### 7️⃣ Remove file from staging
```bash
git reset file.txt
```
*Unstages file but keeps changes*

---

## 🔹 COMMIT COMMANDS

### 8️⃣ Commit changes
```bash
git commit -m "Added login feature"
```
💡 **Professional commit message = what + why**

**📝 Good Examples:**
- `"Add user authentication system"`
- `"Fix navbar responsive design issue"`
- `"Update API endpoint for user data"`

### 9️⃣ View commit history
```bash
git log
```
**📋 Compact version:**
```bash
git log --oneline
```
*Shows commit history in one line per commit*

---

## 🔹 BRANCH COMMANDS

### 🔟 Check branches
```bash
git branch
```
**🌐 All branches (local + remote):**
```bash
git branch -a
```
*Shows current branch with asterisk (*)*

### 1️⃣1️⃣ Create new branch
```bash
git branch feature-auth
```
**🚀 Create + switch (recommended):**
```bash
git checkout -b feature-auth
```

### 1️⃣2️⃣ Switch branch
```bash
git checkout feature-auth
```
**🆕 Modern way:**
```bash
git switch feature-auth
```

### 1️⃣3️⃣ Delete branch
```bash
git branch -d feature-auth
```
**⚠️ Force delete (unmerged changes):**
```bash
git branch -D feature-auth
```

---

## 🔹 REMOTE (GITHUB) COMMANDS

### 1️⃣4️⃣ Check remote connections
```bash
git remote -v
```
*Shows connected remote repositories*

### 1️⃣5️⃣ Add remote repository
```bash
git remote add origin https://github.com/user/repo.git
```
*Links local repo to GitHub repository*

### 1️⃣6️⃣ Push code to GitHub
```bash
git push origin main
```
**🔗 First time (set upstream):**
```bash
git push -u origin main
```

### 1️⃣7️⃣ Pull latest changes
```bash
git pull origin main
```
*Downloads and merges remote changes*

### 1️⃣8️⃣ Fetch (safe update check)
```bash
git fetch
```
*📥 Downloads changes without merging (fetch ≠ pull)*

---

## 🔹 MERGE & CONFLICT RESOLUTION

### 1️⃣9️⃣ Merge branch
```bash
git checkout main
git merge feature-auth
```
*Combines feature branch into main branch*

### 2️⃣0️⃣ Resolve merge conflicts
**🔧 Resolution Steps:**
1. 📂 Open conflicted file in editor
2. 🔍 Find and fix conflict markers:
   ```
   <<<<<<< HEAD
   Your changes
   =======
   Other person's changes
   >>>>>>> branch-name
   ```
3. ✅ Stage resolved file:
   ```bash
   git add file.txt
   ```
4. 💾 Complete merge:
   ```bash
   git commit
   ```

---

## 🔹 UNDO / FIX COMMANDS (⚠️ CRITICAL)

### 2️⃣1️⃣ Undo last commit (keep changes)
```bash
git reset --soft HEAD~1
```
*Removes commit but keeps files staged*

### 2️⃣2️⃣ Remove all changes (🚨 DANGER)
```bash
git reset --hard
```
*⚠️ Permanently deletes all uncommitted changes*

### 2️⃣3️⃣ Discard file changes
```bash
git checkout -- file.txt
```
**🆕 Modern way:**
```bash
git restore file.txt
```
*Reverts file to last committed state*

---

## 🔹 STASH COMMANDS

### 2️⃣4️⃣ Save unfinished work temporarily
```bash
git stash
```
*Saves current changes without committing*

**🔄 Retrieve stashed work:**
```bash
git stash pop
```

**📋 List all stashes:**
```bash
git stash list
```

💡 **Use Case**: Switch branches quickly without committing incomplete work

---

## 🔹 TAGS (VERSION RELEASES)

### 2️⃣5️⃣ Create version tag
```bash
git tag v1.0
```
*Marks specific commit as a release version*

**📤 Push tag to remote:**
```bash
git push origin v1.0
```

**📋 List all tags:**
```bash
git tag
```

💡 **Professional Practice**: Use semantic versioning (v1.0.0, v1.1.0, v2.0.0)

---

## 📚 Essential Commands Quick Reference

| 🔧 Command | 🎯 Purpose | 💡 When to Use |
|------------|------------|----------------|
| `git status` | Check current state | Before every operation |
| `git add .` | Stage all changes | Before committing |
| `git commit -m "message"` | Save changes | After completing feature |
| `git push origin main` | Upload to GitHub | Share your work |
| `git pull origin main` | Get latest changes | Before starting work |
| `git checkout -b branch-name` | Create & switch branch | Start new feature |
| `git merge branch-name` | Combine branches | Integrate completed feature |
| `git stash` | Save work temporarily | Quick branch switching |

---

## 🎯 Professional Workflow

```bash
# Daily Git workflow
git status                    # Check current state
git pull origin main         # Get latest changes
git checkout -b feature-name # Create feature branch
# ... make your changes ...
git add .
git commit -m "Add new feature"
git push origin feature-name
# Create Pull Request on GitHub
```

---

<div align="center">

**💡 Pro Tips for Success**

✅ Always run `git status` before any operation  
✅ Commit frequently with clear messages  
✅ Pull before starting new work  
✅ Use branches for all new features  
✅ Never work directly on main branch  

**🚀 Master these commands and become a Git professional!**

</div>