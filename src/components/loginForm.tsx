'use client'

import { useState } from "react"
import { useLogin } from "@/api/loginAPI"
import { theme } from "@/theme"

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
		<form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 w-80 mx-auto max-w-full">
			<input
				type="text"
				name="name"
				placeholder="name"
				value={formData.name}
				onChange={handleChange}
				required
				className="p-2 border-2 rounded-xl bg-white text-lg"
			/>
			<input
				type="text"
				name="email"
				placeholder="email"
				value={formData.email}
				onChange={handleChange}
				required
				className="p-2 border-2 rounded-xl bg-white text-lg"
			/>
			<button type="submit" className={`p-2 text-white rounded ${theme.bgDark} rounded-full text-lg font-medium`}>
				Submit
			</button>
		</form>
	)
}