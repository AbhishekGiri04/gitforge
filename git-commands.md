# 🔧 Git Commands Reference

## 🔹 What is Git vs GitHub (1 line)
**Git** → Version control tool (runs on your system)  
**GitHub** → Online platform to host Git repositories

---

## 🔹 BASIC SETUP COMMANDS

### 1️⃣ Check Git version
```bash
git --version
```

### 2️⃣ Configure username & email (one time)
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```
**Check config:**
```bash
git config --list
```

---

## 🔹 REPOSITORY COMMANDS

### 3️⃣ Initialize a new repository
```bash
git init
```
*Creates .git folder (hidden).*

### 4️⃣ Clone an existing repository
```bash
git clone https://github.com/user/repo.git
```

---

## 🔹 FILE & STATUS COMMANDS

### 5️⃣ Check status (MOST IMPORTANT)
```bash
git status
```
**Shows:**
- modified files
- staged files  
- untracked files

### 6️⃣ Add files to staging area
**Add one file:**
```bash
git add index.html
```
**Add all files:**
```bash
git add .
```

### 7️⃣ Remove file from staging
```bash
git reset file.txt
```

---

## 🔹 COMMIT COMMANDS

### 8️⃣ Commit changes
```bash
git commit -m "Added login feature"
```
💡 **Good commit message = what + why**

### 9️⃣ See commit history
```bash
git log
```
**Short version:**
```bash
git log --oneline
```

---

## 🔹 BRANCH COMMANDS

### 🔟 Check branches
```bash
git branch
```
**All branches (local + remote):**
```bash
git branch -a
```

### 1️⃣1️⃣ Create new branch
```bash
git branch feature-auth
```
**Create + switch:**
```bash
git checkout -b feature-auth
```

### 1️⃣2️⃣ Switch branch
```bash
git checkout feature-auth
```
**(New way)**
```bash
git switch feature-auth
```

### 1️⃣3️⃣ Delete branch
```bash
git branch -d feature-auth
```
**Force delete:**
```bash
git branch -D feature-auth
```

---

## 🔹 REMOTE (GITHUB) COMMANDS

### 1️⃣4️⃣ Check remote URL
```bash
git remote -v
```

### 1️⃣5️⃣ Add remote repository
```bash
git remote add origin https://github.com/user/repo.git
```

### 1️⃣6️⃣ Push code to GitHub
```bash
git push origin main
```
**First time:**
```bash
git push -u origin main
```

### 1️⃣7️⃣ Pull latest changes
```bash
git pull origin main
```

### 1️⃣8️⃣ Fetch (safe update check)
```bash
git fetch
```
*(fetch ≠ pull)*

---

## 🔹 MERGE & CONFLICT COMMANDS

### 1️⃣9️⃣ Merge branch
```bash
git checkout main
git merge feature-auth
```

### 2️⃣0️⃣ Resolve merge conflict
**Steps:**
1. Open conflicted file
2. Fix `<<<<<<<`, `=======`, `>>>>>>>`
3. Add file:
   ```bash
   git add file.txt
   ```
4. Commit:
   ```bash
   git commit
   ```

---

## 🔹 UNDO / FIX COMMANDS (VERY IMPORTANT)

### 2️⃣1️⃣ Undo last commit (keep code)
```bash
git reset --soft HEAD~1
```

### 2️⃣2️⃣ Remove changes (DANGER)
```bash
git reset --hard
```

### 2️⃣3️⃣ Discard file changes
```bash
git checkout -- file.txt
```
**(New)**
```bash
git restore file.txt
```

---

## 🔹 STASH COMMANDS

### 2️⃣4️⃣ Save unfinished work
```bash
git stash
```
**Get back:**
```bash
git stash pop
```

---

## 🔹 TAGS (RELEASE)

### 2️⃣5️⃣ Create tag
```bash
git tag v1.0
```
**Push tag:**
```bash
git push origin v1.0
```

---

## 📚 Quick Reference Summary

| Command | Purpose |
|---------|---------|
| `git status` | Check file status |
| `git add .` | Stage all files |
| `git commit -m "message"` | Commit changes |
| `git push origin main` | Push to GitHub |
| `git pull origin main` | Get latest changes |
| `git checkout -b branch-name` | Create & switch branch |
| `git merge branch-name` | Merge branch |
| `git stash` | Save work temporarily |

---

*💡 **Pro Tip**: Always run `git status` before any operation to understand your current state!*