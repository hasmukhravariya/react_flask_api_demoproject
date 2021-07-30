import { render as rtlRender, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { TASK_REGISTER } from "../components/TaskRegister"
import { USER_UPDATE } from "../components/UserProfile"
import { TASKS_QUERY } from "../components/Home"
import UserProfile from "../components/UserProfile"
import Routes from "../Routes"
import { LocalStorageMock } from '@react-mock/localstorage';
import wait from "waait"

const user={
	email: false,
	google: true,
	data: {
		address: null,
		email: "hasmukh16000@gmail.com",
		id: "3",
		image: "https://lh3.googleusercontent.com/a/AATXAJytw9wkZG5Frd35_RS5K1ISrLo3VCypLj86PHK9=s96-c",
		name: "Hasmukh Patel",
		password: "true",
		phone: null,
		username: "has"
	}
}

const tasks=[
	{
		"id": "1",
		"assigned": "Hasmukh Ravariya",
		"title": "React Testing library",
		"status": "Hold",
		"description": "Look into documentation of react testing library",
		"creater": "Aman Singh"
	},
	{
		"id": "3",
		"assigned": "Hasmukh Ravariya",
		"title": "React Testing library",
		"status": "In Progress",
		"description": "Look into documentation of react testing library",
		"creater": "Aman Singh"
	},
	{
		"id": "19",
		"assigned": "Hasmukh Ravariya",
		"title": "Demo Project",
		"status": "Open",
		"description": "Create Demo project using React and flask api",
		"creater": "Aman Singh"
	}
]

const mocks=[
	{
		request:{
			query:USER_UPDATE,
			variables:{
				"updateUserInput": {
			    "data":{
			      "address": "Bandra",
			      "email": "hasmukh16000@gmail.com",
			      "id": "3",
			      "image": "https://lh3.googleusercontent.com/a/AATXAJytw9wkZG5Frd35_RS5K1ISrLo3VCypLj86PHK9=s96-c",
			      "name": "Hasmukh Patel",
			      "password": "true",
			      "phone": "7021656536",
			      "username": "has"
			    }
			  },
			}
		},
		result:{
		  "data": {
		    "updateUser": {
		      "status": true,
		      "errors": null,
		      "user": {
		        "id": "3",
		        "phone": "7021656536",
		        "address": "Bandra",
		        "email": "hasmukh16000@gmail.com",
		        "password": "true",
		        "name": "Hasmukh Patel",
		        "username": "has",
		        "image": "https://lh3.googleusercontent.com/a/AATXAJytw9wkZG5Frd35_RS5K1ISrLo3VCypLj86PHK9=s96-c"
		      }
		    }
		  }
		}
	},
	{
		request:{
			query:TASKS_QUERY
		},
		result:{
		  "data": {
		    "tasks": tasks
		  }
		}
	},
	{
		request:{
			query:TASK_REGISTER,
			variables:{
				createTaskInput: {
				    title:"Graphql create test",
				    creater:"Hasmukh Patel",
				    assigned:"Hasmukh",
				    description:"Graphql create task test",
				    status:"Open"
				},
			}
		},
		result:{
		  data: {
		    createTask: {
		      status: true,
		      errors: null,
		      task: {
		        id: "83"
		      }
		    }
		  }
		}
	},

]

const taskmocks=[
	{
		request:{
			query:TASK_REGISTER,
			variables:{
				createTaskInput: {
				    title:"Graphql create test",
				    creater:"Hasmukh Patel",
				    assigned:"Hasmukh",
				    description:"Graphql create task test",
				    status:"Open"
				},
			}
		},
		result:{
		  data: {
		    createTask: {
		      status: true,
		      errors: null,
		      task: {
		        id: "83"
		      }
		    }
		  }
		}
	},
];
describe("UserProfile Page test", () => {

	const render = (ui,{route="/userprofile",mock=mocks,...renderOptions} = {}) => {
	    window.history.pushState({}, 'Form page', route)
	    const Wrapper = ({ children }) => (
	      <MockedProvider mocks={mock} addTypename={false}>
	      	<LocalStorageMock items={{ user: JSON.stringify(user) }}>
	      		<Routes>
	      			{children}
				</Routes>
			</LocalStorageMock>
	      </MockedProvider>
	    );
	    return rtlRender(ui, { wrapper:Wrapper, ...renderOptions });
	};


	test('renders image, login, register button', async() => {
    	render(<UserProfile/>)
    	expect(screen.getByLabelText(/Home/i)).toBeInTheDocument();
  	});

  	test('Update User Data', async() => {
    	render(<UserProfile/>)
    	userEvent.type(screen.getByLabelText(/phone/i), "7021656536");
    	userEvent.type(screen.getByLabelText(/address/i), "Bandra");
    	expect(screen.getByText(/Save Changes/i)).toBeInTheDocument();
    	fireEvent.click(screen.getByText(/Save Changes/i))
    	await waitFor(() => {
    		const temp={
    			email: false,
				google: true,
				imageHash:"",
				data: {
					"id": "3",
			        "phone": "7021656536",
			        "address": "Bandra",
			        "email": "hasmukh16000@gmail.com",
			        "password": "true",
			        "name": "Hasmukh Patel",
			        "username": "has",
			        "image": "https://lh3.googleusercontent.com/a/AATXAJytw9wkZG5Frd35_RS5K1ISrLo3VCypLj86PHK9=s96-c"
				}
    		}
    		const result=localStorage.getItem('user');
    		const obj=JSON.parse(result)
    		temp.imageHash=obj.imageHash;
    		expect(JSON.stringify(obj)).toBe(JSON.stringify(temp));
    	})
  	});

  	test('renders task form on add task click', async() => {
    	render(<UserProfile/>)
    	expect(screen.getByLabelText(/add_task/i)).toBeInTheDocument();
    	fireEvent.click(screen.getByLabelText(/add_task/i))
    	expect(screen.getByText(/Task Form/i)).toBeInTheDocument();
    	userEvent.type(screen.getByLabelText(/title/i), "Graphql create test");
    	userEvent.type(screen.getByLabelText(/assigned/i), "Hasmukh");
    	userEvent.type(screen.getByLabelText(/description/i), "Graphql create task test");
    	expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    	fireEvent.click(screen.getByText(/Submit/i))
    	await wait(0)
    	await wait(0)
    	expect(screen.getByText(/Task Table/i)).toBeInTheDocument(); 

  	});

});