import { LoginForm } from "@/components/loginForm";
import { theme } from "@/theme";

export default function Login() {
	return (
		<div className={`mt-5 py-10 border border-8 rounded-4xl flex flex-col items-center ${theme.bg}`}>
			<h1
				className="text-2xl md:text-4xl font-semibold text-center mb-2 mx-2"
			>
				Welcome! Log in to begin your search
			</h1>
			<h2
				className="text-lg font-medium mb-5"
			>
				Doggies are a few clicks away!
			</h2>
			<LoginForm />
		</div>
	)
}