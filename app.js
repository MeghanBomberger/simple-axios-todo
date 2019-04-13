const taskAdder = document.taskAdder

const pendingTasks = document.getElementById('pendingTasks')
const completedTasks = document.getElementById('completedTasks')
const progressBar = document.getElementById('progressBar')

//SECTION - GET
function fetchTasks(){
    axios.get('https://api.vschool.io/meghan/todo/').then(function(response){
        const data = response.data;
        console.log(data)

        const totalTasks = data.length
        console.log(`You currently have ${totalTasks} task in system.`)  
        console.log('Formating data...') 

        //CLEAR DISPLAY
        pendingTasks.innerHTML = ''
        completedTasks.innerHTML = ''
        
        //TASK FORMATING FOR LOOP 
        let completedTaskTally = 0
        for(var i = 0; i < totalTasks; i++){
            console.log(`Task ID: ${data[i]._id}`)
  
            //JSON data variables
            let taskID = data[i]._id
            let taskTitle = data[i].title
            let taskStatus = data[i].completed
            let taskDescription = data[i].description
            let taskPriority = data[i].price
            let taskImg = data[i].imgUrl
            
            //task wrapper elements
            const taskWrapper = document.createElement('form')
            taskWrapper.setAttribute('class', 'task-wrapper')
            taskWrapper.setAttribute('id', taskID)
            taskWrapper.setAttribute('name', 'taskWrapper')
            
            //create wrapper contents
            const imgBox = document.createElement('img')
            imgBox.setAttribute('class', 'img-box')
            imgBox.setAttribute('id', 'imgBox')
            imgBox.setAttribute('src', taskImg)
            
            const textWrapper = document.createElement('div')
            textWrapper.setAttribute('class', 'text-wrapper')
            textWrapper.setAttribute('id', 'textWrapper')
            
            const titleTask = document.createElement('h2')
            titleTask.setAttribute('class', 'task-title')
            titleTask.setAttribute('id', 'titleTask')
            titleTask.textContent = taskTitle
            
            const describeTask = document.createElement('p')
            describeTask.setAttribute('class', 'describe-task')
            describeTask.setAttribute('id', 'describeTask')
            describeTask.textContent = taskDescription
                        
            const priorityStars = document.createElement('div')
            priorityStars.setAttribute('class', 'priority-stars')
            priorityStars.setAttribute('id', 'priorityStars')
            for(var j = 0; j < taskPriority; j++){
                const star = document.createElement('span')
                star.textContent = '★'
                star.setAttribute('class', 'bright-star')
                priorityStars.appendChild(star)
            }
            
            textWrapper.appendChild(priorityStars)
            textWrapper.appendChild(titleTask)
            textWrapper.appendChild(describeTask)
                        
            const buttonWrapper = document.createElement('div')
            buttonWrapper.setAttribute('class', 'button-wrapper')
            buttonWrapper.setAttribute('id', 'buttonWrapper')
            if(taskStatus != true){
                const completeButton = document.createElement('button')
                completeButton.setAttribute('class', 'complete-button')
                completeButton.setAttribute('id', 'completeButton')
                completeButton.textContent = 'mark complete'
                completeButton.addEventListener('click', function(e){
                    console.log(e)
                    e.preventDefault()
                    const id = e.target.parentNode.parentNode.id
                    console.log(id)
                    updateTask = {
                        completed: true
                    }
                    axios.put('https://api.vschool.io/meghan/todo/' + id, updateTask).then(function(response){
                        refresh()
                    }).catch(err => console.log(err))
                
                    console.log(`Updating task #${id}`)
                })
                buttonWrapper.appendChild(completeButton)
            } else if (taskStatus != false){              
                const pendButton = document.createElement('button')
                pendButton.setAttribute('class', 'pend-button')
                pendButton.setAttribute('id', 'pendButton')
                pendButton.textContent = 'mark pending'
                pendButton.addEventListener('click', function(e){
                    console.log(e)
                    e.preventDefault()
                    const id = e.target.parentNode.parentNode.id
                    console.log(id)
                    updateTask = {
                        completed: false
                    }
                    axios.put('https://api.vschool.io/meghan/todo/' + id, updateTask).then(function(response){
                        refresh()
                    }).catch(err => console.log(err))
                
                    console.log(`Updating task #${id}`)
                })
                buttonWrapper.appendChild(pendButton)
            }

            const editButton = document.createElement('button')
            editButton.setAttribute('class', 'edit-button')
            editButton.setAttribute('id', 'editButton')
            editButton.textContent = 'edit'
            editButton.addEventListener('click', editTask)
            
            const deleteButton = document.createElement('button')
            deleteButton.setAttribute('class', 'delete-button')
            deleteButton.setAttribute('id', 'deleteButton')
            deleteButton.textContent = 'delete'
            deleteButton.addEventListener('click', function(e){
                console.log(e)
                e.preventDefault()
                const id = e.target.parentNode.parentNode.id
                console.log(id)
                axios.delete(`https://api.vschool.io/meghan/todo/${id}`).then(response => {
                    e.target.parentNode.remove()
                    refresh()
                })
            })
            
            buttonWrapper.appendChild(editButton)
            buttonWrapper.appendChild(deleteButton)
            
            taskWrapper.appendChild(imgBox)
            taskWrapper.appendChild(textWrapper)
            taskWrapper.appendChild(buttonWrapper)
            
            if(taskStatus != true){
                console.log('This is a completed task.')  
                pendingTasks.appendChild(taskWrapper)
            } else if(taskStatus != false){
                console.log('This is a pending task.')  
                completedTasks.appendChild(taskWrapper)
                completedTaskTally = completedTaskTally + 1
            }  
            console.log(taskWrapper) 
        }
        let progressRatio = completedTaskTally / data.length
        progressRatio === 0 ? progressRatio = 0.01
            : progressRatio = progressRatio
        progressBar.style.width = `${progressRatio * 100}%`
        console.log(`current progress ratio is ${progressRatio}`)
    })
    console.log('Display update complete.')
}
fetchTasks()

//SECTION - POST
taskAdder.addTaskButton.addEventListener('click', function(event){
    event.preventDefault()
    console.log(event)
    console.log('Initiating adding task...')
    
    let newTaskTitle = taskAdder.addTaskTitle.value
    let newTaskImgSelection = taskAdder.addTaskImg.value
    let newTaskPrioritySelection = taskAdder.addTaskPriority.value
    let newTaskDescription = taskAdder.addTaskDescription.value
    
    //assign image
    const imgArray = [
        {
            name: 'cleaning',
            url: 'task-icons/003-wash.png',
        },{
            name: 'laundry',
            url: 'task-icons/004-wash-1.png',
        },{
            name: 'errands',
            url: 'task-icons/005-supermarket.png',
        },{
            name: 'bills',
            url: 'task-icons/006-pay.png',
        },{
            name: 'business',
            url: 'task-icons/007-money.png',
        },{
            name: 'cook',
            url: 'task-icons/008-food.png',
        },{
            name: 'brainstorm',
            url: 'task-icons/011-question.png',
        },{
            name: 'onlineGaming',
            url: 'task-icons/012-headset.png',
        },{
            name: 'create',
            url: 'task-icons/024-draw.png',
        },{
            name: 'repair',
            url: 'task-icons/022-wrench.png',
        },{
            name: 'plan',
            url: 'task-icons/023-data.png',
        },{
            name: 'design',
            url: 'task-icons/021-art.png',
        },{
            name: 'write',
            url: 'task-icons/020-pencil.png',
        },{
            name: 'consoleGaming',
            url: 'task-icons/025-joystick.png',
        },{
            name: 'dnd',
            url: 'task-icons/026-dice.png',
        },{
            name: 'carMaintence',
            url: 'task-icons/028-car.png',
        },{
            name: 'worldDominiation',
            url: 'task-icons/029-world.png',
        },{
            name: 'networking',
            url: 'task-icons/030-team.png',
        }
    ]
    let newTaskImg = 'nav-icons/009-list.png'
    for(var i = 0; i < imgArray.length; i++){
        imgArray[i].name == newTaskImgSelection ? newTaskImg = imgArray[i].url
            : newTaskImg = newTaskImg
    }
    
    //assign priority
    let newTaskPriority = 0
    newTaskPrioritySelection == 'veryLow' ? newTaskPriority = 1
        : newTaskPrioritySelection == 'low' ? newTaskPriority = 2
        : newTaskPrioritySelection == 'moderate' ? newTaskPriority = 3
        : newTaskPrioritySelection == 'high' ? newTaskPriority = 4
        : newTaskPrioritySelection == 'veryHigh' ? newTaskPriority = 5
        : newTaskPriority = newTaskPriority
    
    //format for api
    let newTask =  {
        completed: false,
        title: newTaskTitle,
        description: newTaskDescription,
        price: newTaskPriority,
        imgUrl: newTaskImg
    }
    
    //send to api
    axios.post('https://api.vschool.io/meghan/todo', newTask).then(res => {
        fetchTasks()
        taskAdder.addTaskTitle.value = ''
        taskAdder.addTaskImg.value = ''
        taskAdder.addTaskDescription.value = ''
        taskAdder.addTaskPriority.value = ''
    }).catch(err => console.log(err))

    //reset display
    console.log('post complete')
})

function refresh(){
    fetchTasks()
}

// SECTION - PUT
// FIXME 
function editTask(x){ 
    //delete alert
    alert('The edit task feature is not yet available. As a temporary work around, please add a new task with the correct information and delete the outdated copy. Sorry for the inconvience.')
    //create save button
        //remove event listener
        //change text to save
        //add eventlistenr
    //deactivate other buttons    
    //build img input field
    const editTaskImg = taskAdder.addTaskImg
    editTaskImg.setAttribute('name', 'editTaskImg')
    editTaskImg.setAttribute('id', 'editTaskImg')
    editTaskImg.setAttribute('class', 'edit-task-img')
    //build title input
    //build description input
    //build priority star buttons input
    //hide image
    //replace image with input labels
    //replace text with input fields and dropdown
    //replace stars with buttons
    //capture new info
    //format new info as object for the api
    //put to the api
    //restore/update display - verify that all alterations to make the form are reversed
   
}