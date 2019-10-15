const express = require('express')

const server = express()

server.use(express.json())

/**
 * Var to count number of requests
 */
let requests = 1
const projects = [
    { id: "1", title: "Projeto 1", tasks: ["Tarefa 1", "tarefa 2"] },
    { id: "2", title: "Projeto 2", tasks: ["Tarefa 1", "tarefa 2"] },
    { id: "3", title: "Projeto 3", tasks: ["Tarefa 1", "tarefa 2"] },
]

/**
 * Middleware to check if Project exists
 */
function checkProjectId(req, res, next) {
    const { id } = req.params
    const project = projects.find(p => p.id === id)
    if (!project) {
        return res.status(400).json({ error: 'Project does not exists' })
    }

    return next()
}

/**
 * Middleware to count the requests
 */
server.use((req, res, next) => {
    console.log(`App Requests: ${requests++}`)
    return next()
})

/**
 * Project Routes
 */
server.get('/projects', (req, res) => {
    return res.json(projects)
})

server.get('/projects/:id', checkProjectId, (req, res) => {
    const projectId = req.params.id
    const project = projects.filter(i => i.id === projectId)
    return res.json(project)
})

server.post('/projects', (req, res) => {
    const body = req.body
    projects.push(body)
    return res.json(projects)
})

server.put('/projects/:id', checkProjectId, (req, res) => {
    const { id } = req.params
    const { title } = req.body
    const project = projects.find(p => p.id === id)
    project.title = title
    return res.json(projects)
})

server.delete('/projects/:id', checkProjectId, (req, res) => {
    const { id } = req.params
    const project = projects.findIndex(p => p.id === id)
    projects.splice(project, 1)
    return res.json(projects)
})

/**
 * Tasks
 */
server.post('/projects/:id/tasks', checkProjectId, (req, res) => {
    const { id } = req.params
    const { title } = req.body
    const project = projects.find(p => p.id === id)
    project.tasks.push(title)
    return res.json(projects)
})

server.listen(3000)