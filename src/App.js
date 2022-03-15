import './App.css';
import {useEffect, useState} from 'react'
import axios from 'axios'
import Modal from 'react-modal'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

let baseURL = 'https://red-sky-application.herokuapp.com'

function App() {
  
  const [newUser, setNewUser] = useState(false)
  const [editUser, setEditUser] = useState(false)
  const [deleteUser, setDeleteUser] = useState(false)
  const [deleteFull, setDeleteFull] = useState({})
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [picUrl, setPicUrl] = useState('')
  const [userList, setUserList] = useState([])
  const [newId, setNewId] = useState(3)

  const toggleNewUser = () => {
    setNewUser(!newUser)
  }
  const toggleEditUser = () => {
    setEditUser(!editUser)
  }
  
  const toggleDeleteUser = (id) => {
    axios.get(`${baseURL}/getOneUser/${id}`)
    .then(res => {
      setDeleteFull(res.data)
    })
    .catch(err => {
      console.log(err)
    })
    setDeleteUser(!deleteUser)
  }

  useEffect(() =>{
    axios.get(`${baseURL}/seed`)
      .then((res) => {
        setUserList([...res.data])
      })
      .catch((err) => {
        console.log(err)
      })    
  }, [])

// GET ONE USER

  const getOneUser = (id) => {      
    axios.get(`${baseURL}/getOneUser/${id}`)
      .then(res => {
        setNewId(res.data.id)
        setFirstName(res.data.first_name)
        setLastName(res.data.last_name)
        setEmailAddress(res.data.email)
        setPicUrl(res.data.avatar)
        toggleEditUser()
      })
      .catch(err => {
        console.log(err)
      })
  }

// ADD USER

  let body = {
    email: emailAddress,
    first_name: firstName,
    last_name: lastName,
    avatar: picUrl
  }
  
  const addUser = () => {
    axios.post(`${baseURL}/addUser`, body)
      .then(res => {
        console.log(res.data)
        setFirstName('')
        setLastName('')
        setEmailAddress('')
        setPicUrl('')
        toggleNewUser()
        setUserList([...res.data])

        toast('User Added!', {
          className:'custom-toast',
          draggable: true,
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose:2000,
          theme:'dark',
          style:{
              backgroundColor:'#DD013F',
              color:'white',
              textAlign:'center',
          },
      })

      })
      .catch(err => {
        console.log('Add user error ' + err)
      })
  }

// UPDATE USER

  const updateUser = () => {
    let editBody = {
      id: +newId,
      email: emailAddress,
      first_name: firstName,
      last_name: lastName,
      avatar: picUrl
    }

    axios.put(`${baseURL}/editUser/${newId}`, editBody)
      .then(res => {
        setUserList([...res.data])
        toggleEditUser()
        
        toast('User Updated!', {
          className:'custom-toast',
          draggable: true,
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose:2000,
          theme:'dark',
          style:{
              backgroundColor:'#DD013F',
              color:'white',
              textAlign:'center',
          },
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

// DELETE USER
  const confirmDelete = (id) => {
    deleteButton(id)
  }

  const deleteButton = (item) => {
    axios.delete(`/deleteUser/${item}`)
      .then(res => {
        setUserList([...res.data])
        
        toast('User Deleted!', {
          className:'custom-toast',
          draggable: true,
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose:2000,
          theme:'dark',
          style:{
              backgroundColor:'#DD013F',
              color:'white',
              textAlign:'center',
          },
       })
      })
      .catch(err => {
        console.log(err)
      })
      toggleDeleteUser()
  }

  return (
    <div className="App">
      <section id='logo'>RED SKY CODING CHALLENGE</section>
      <section id='userSection'>
        <button onClick={toggleNewUser}>CREATE NEW USER</button>  
      </section>
      <section id='userListFull'>
        <section id='userListTop'>
          <h2 id='userList'>
            USER LIST
          </h2>
        </section>
        <table>
          <thead>
            <tr className='tableHead'>
              <th>AVATAR</th>
              <th>FIRST NAME</th>
              <th>LAST NAME</th>
              <th>EMAIL ADDRESS</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user, i) => {
              let id = user.id
              return (
                <tr key={`${id}`} >
                  <td><img src={`${user.avatar}`} className='tablePic'/></td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.email}</td>
                  <td><button onClick={() => getOneUser(id)}>EDIT</button></td>
                  <td><button onClick={() => toggleDeleteUser(id)}>DELETE</button></td>
                </tr>
                                  
                )
              })
            }
          </tbody>
        </table>
      </section>

{/* Add New User Modal */}
      <Modal 
        id='newUserModal' 
        isOpen={newUser} 
        onRequestClose={toggleNewUser}
        style={{
          padding: '0px',
          overlay: {
            backgroundColor: 'rgba(128, 128, 128, 0.6)'
            }
          }}
        >
        <section id='newUser'>
          <section id='userInputHeader'>
              <p id='userInputHeaderTop'>ADD USER</p>
          </section>

          <section className='userInputSection'>
            <span className='inputHeader'>FIRST NAME</span>
            <input className='userInputField' onChange={(e) => setFirstName(e.target.value)}/>
          </section>
          <section className='userInputSection'>
            <span className='inputHeader'>LAST NAME</span>
            <input className='userInputField' onChange={(e) => setLastName(e.target.value)}/>
          </section>
          <section className='userInputSection'>
            <span className='inputHeader'>EMAIL ADDRESS</span>
            <input className='userInputField' onChange={(e) => setEmailAddress(e.target.value)}/>
          </section>
          <section className='userInputSection'>
            <span className='inputHeader'>AVATAR IMAGE LINK</span>
            <input className='userInputField' onChange={(e) => setPicUrl(e.target.value)}/>        
          </section>

          <section className='confirm'>
            <button className='cancel' onClick={toggleNewUser}>Cancel</button>
            <button className='save' onClick={() => addUser(body)}>Save</button>
          </section>

        </section>
      </Modal>

{/* Edit User Modal */}
      <Modal 
        id='editUserModal'
        isOpen={editUser}
        onRequestClose={toggleEditUser}
        style={{
          overlay: {
            backgroundColor: 'rgba(128, 128, 128, 0.6)'
            }
         }}
        >
        <section id='editUser'>
          <section id='userInputHeader'>
            <p id='userInputHeaderTop'>EDIT USER</p>
          </section>

          <section className='userInputSection'>
            <span className='inputHeader'>FIRST NAME</span>
            <input className='userInputField' placeholder='First name' value={firstName}  onChange={(e) => setFirstName(e.target.value)}/>
          </section>
          <section className='userInputSection'>
            <span className='inputHeader'>LAST NAME</span>
            <input className='userInputField' placeholder='Last name' value={lastName}  onChange={(e) => setLastName(e.target.value)}/>
          </section>
          <section className='userInputSection'>
            <span className='inputHeader'>EMAIL ADDRESS</span>
            <input className='userInputField' placeholder='Email address' value={emailAddress}  onChange={(e) => setEmailAddress(e.target.value)}/>
          </section>
          <section className='userInputSection'>
            <span className='inputHeader'>AVATAR IMAGE LINK</span>
            <input className='userInputField' placeholder='Image link' value={picUrl} onChange={(e) => setPicUrl(e.target.value)}/>        
          </section>

          <section className='confirm'>
            <button className='cancel' onClick={toggleEditUser}>Cancel</button>
            <button className='save' onClick={() => updateUser(body)}>Save</button>
          </section>

        </section>
      </Modal>

{/* Confirm Delete Modal */}
      <Modal 
        id='deleteUserModal'
        isOpen={deleteUser}
        onRequestClose={toggleDeleteUser}
        style={{
          overlay: {
            backgroundColor: 'rgba(128, 128, 128, 0.6)'
            }
          }}
        >
          <section id='deleteUser'>
            <section id='userInputHeader'>
              <p id='userInputHeaderTop'>CONFIRM DELETE?</p>
            </section>

            <section className='userInputSection'>
              <span className='inputHeader'>Are you sure you want to delete {deleteFull.first_name} {deleteFull.last_name}? </span>
            </section>

            <section className='confirm'>
              <button className='cancel' onClick={() => toggleDeleteUser(0)}>Cancel</button>
              <button className='save' onClick={() => confirmDelete(deleteFull.id)}>Confirm</button>
            </section>

          </section>
        </Modal>
        <ToastContainer/>
    </div>
  );
}

export default App;

