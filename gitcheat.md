#Git Cheat Sheet

	git status
shows modified files in current branch
red = ready to add
green = ready to commit

	git reset --hard
gets rid all changes

	git branch
shows all available branches

	git log
shows all changes to current branch (most recent first)

	get checkout branchname
switch to branch branchname

	get checkout -b branchname
create and swithc to new branch branchname

	git add modifiedfilename
any files listed in red under git status will be updated to green
and be ready to commit

	git commit -m "write some change here"
any files listed in green under git status will be commited
and ready to be pushed

	git push origin branchname
push any commited files to server side

	git branch -d branchname
delete branchname from local side, make sure to switch out of branch
you want to delete

	git pull origin branchname
pull all files and changes from server