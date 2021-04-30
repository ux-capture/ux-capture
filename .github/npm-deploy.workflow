workflow "Publish UX Capture NPM modules" {
  on = "push"
  resolves = ["Publish NPM modules"]
}

action "Filter Main Branch" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Publish NPM modules" {
    needs = "Filter Main Branch"
}