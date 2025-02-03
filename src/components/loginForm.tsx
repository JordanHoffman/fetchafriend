'use client'

import { useState } from "react"
import { useLogin } from "@/api/loginAPI"

export const LoginForm = () => {
	const { triggerLogin } = useLogin()
	const [formData, setFormData] = useState({ name: "", email: "" })

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const { name, email } = formData
		triggerLogin({ name, email })
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded-md w-80">
			<input
				type="text"
				name="name"
				placeholder="name"
				value={formData.name}
				onChange={handleChange}
				required
				className="p-2 border rounded"
			/>
			<input
				type="text"
				name="email"
				placeholder="email"
				value={formData.email}
				onChange={handleChange}
				required
				className="p-2 border rounded"
			/>
			<button type="submit" className="p-2 bg-blue-500 text-white rounded">
				Submit
			</button>
		</form>
	)
}