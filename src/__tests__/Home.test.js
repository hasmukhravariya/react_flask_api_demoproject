import { render as rtlRender, screen, cleanup, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import { TASKS_QUERY } from "../components/Home"
import { TASK_REGISTER } from "../components/TaskRegister"
import Home from "../components/Home"
import Routes from "../Routes"
import { LocalStorageMock } from '@react-mock/localstorage';
import wait from "waait"

const user={
	email: true,
	google: false,
	data: {
		address: "Bandra, Mumbai, Maharashtra, India",
		email: "hasmukh16000@gmail.com",
		id: "3",
		image: "https://lh3.googleusercontent.com/a/AATXAJytw9wkZG5Frd35_RS5K1ISrLo3VCypLj86PHK9=s96-c",
		name: "Hasmukh Patel",
		password: "true",
		phone: "7021696536",
		username: "has",
		__typename: "user"
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
		        id: "83",
		        title:"Graphql create test",
			    creater:"Hasmukh Patel",
			    assigned:"Hasmukh",
			    description:"Graphql create task test",
			    status:"Open"
		      }
		    }
		  }
		}
	},

]

afterEach(cleanup);

describe("Home Page test", () => {

	const render = (ui,{route="/home",mock=mocks,...renderOptions} = {}) => {
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
    	const component=render(<Home/>)
    	await waitFor(() => {
    		expect(localStorage.getItem('user')).toBe(JSON.stringify(user));
    		expect(screen.getByText(/Task Table/i)).toBeInTheDocument(); 
    		expect(screen.getByText(/19/i)).toBeInTheDocument(); 

    	});
  	});

  	test('renders task form on add task click', async() => {
  		const component=render(<Home/>)
    	await wait(0);
		expect(screen.getByLabelText(/add_task/i)).toBeInTheDocument();
    	fireEvent.click(screen.getByLabelText(/add_task/i))
    	expect(screen.getByText(/Task Form/i)).toBeInTheDocument();
    	userEvent.type(screen.getByLabelText(/title/i), "Graphql create test");
    	userEvent.type(screen.getByLabelText(/assigned/i), "Hasmukh");
    	userEvent.type(screen.getByLabelText(/description/i), "Graphql create task test");
    	expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    	fireEvent.click(screen.getByText(/Submit/i))
    	await waitFor(() => {
    		// const temp={
		    //     id: "83",
		    //     title:"Graphql create test",
			   //  creater:"Hasmukh Patel",
			   //  assigned:"Hasmukh",
			   //  description:"Graphql create task test",
			   //  status:"Open"
    		// }
    		// tasks.push(temp)
    		// render(<Home/>)
    		// console.log(screen.debug())
    		expect(screen.getByText(/Task Table/i)).toBeInTheDocument(); 
    	})
  	});

  	test('renders user profile on name click', async() => {
  		const component=render(<Home/>)
    	await wait(0);
    	expect(screen.getByLabelText(/user_profile/i)).toBeInTheDocument();
    	fireEvent.click(screen.getByLabelText(/user_profile/i))
    	expect(screen.getByLabelText(/view_profile/i)).toBeInTheDocument();
    	fireEvent.click(screen.getByLabelText(/view_profile/i))
    	expect(screen.getByText(/Save Changes/i)).toBeInTheDocument();
  	});

});