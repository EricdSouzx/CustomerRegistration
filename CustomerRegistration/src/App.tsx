import { useEffect, useState, useRef, FormEvent } from 'react'
import { FiTrash } from 'react-icons/fi'
import { api } from './services/api'

interface CustomersProps {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
}

export default function App() {

  const [customers, setCustomers] = useState<CustomersProps[]>([]);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    const response = await api.get("/customers");
    setCustomers(response.data);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!nameRef.current?.value || !emailRef.current?.value) return;

    const response = await api.post("/customer", {
      name: nameRef.current?.value,
      email: emailRef.current?.value
    });

    setCustomers(allCustomers => [...allCustomers, response.data])

    nameRef.current.value = ""
    emailRef.current.value = ""
  }

  async function handleDelete(id: string) {
    try {
      await api.delete("/customer", {
        params: {
          id: id,
        }
      })

      const allCustomers = customers.filter( (customer) => customer.id !== id);
      setCustomers(allCustomers);

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="w-full min-h-screen bg-neutral-900 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-3xl font-medium text-white">Customers</h1>

        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <label className="font-normal text-sm text-neutral-700 py-3">Name</label>
          <input
            type="text"
            placeholder="Enter your name..."
            className="w-full mb-5 p-2 bg-neutral-900 rounded-full border-2 border-neutral-800 outline-none 
            text-white py-3 hover:border-sky-500 duration-200 ps-9"
            ref={nameRef}
          />

          <label className="font-normal text-sm text-neutral-700 py-2">E-mail</label>
          <input
            type="email"
            placeholder="Enter your email..."
            className="w-full mb-5 p-2 bg-neutral-900 rounded-full border-2 border-neutral-800 outline-none 
            text-white py-3 hover:border-sky-500 duration-200 ps-9"
            ref={emailRef}
          />

          <input
            type="submit"
            value="Register"
            className="cursor-pointer w-full p-2 bg-sky-500 py-3.5 rounded-full text-white font-medium my-6"
          />

          <section className="flex flex-col gap-5 mt-5">

            {customers.map((customer) => (
              <article
                key={customer.id}
                className="w-full bg-neutral-900 rounded-lg p-8 relative hover:scale-105 duration-200 border-2 border-solid
              border-neutral-800 shadow-2xl">
                <p className='text-white text-sm'><span className="font-medium text-white text-base cursor-default">Name: </span>{customer.name}</p>
                <p className='text-white text-sm'><span className="font-medium text-white text-base cursor-default">Email: </span>{customer.email}</p>
                <p className='text-green-500 text-sm font-bold'><span className="font-medium text-white text-base cursor-default">Status: </span>{customer.status ? "Ativo" : "Inativo"}</p>

                <button 
                  className='bg-red-700 w-7 h-7 flex justify-center items-center rounded-full absolute -right-3.5 -top-2'
                  onClick={ () => handleDelete(customer.id) }
                  >
                  <FiTrash size={15} color="#FFF" />
                </button>
              </article>
            ))};

          </section>

        </form>
      </main>
    </div>
  )
}