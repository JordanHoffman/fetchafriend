import { useForm, type SubmitHandler } from "react-hook-form"
type Inputs = {
	zip: string
}
export const ZipSearch = () => {
	const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({ 
		mode: "onSubmit",
		reValidateMode: "onSubmit"
	})
  const onSubmit: SubmitHandler<Inputs> = (data) => {
		//user entered zip
		if (data.zip) {

		}
		//empty
		else {

		}
	}
	console.log(watch("zip")) // watch input value by passing the name of it
	return (
    <form
			className="flex"
			onSubmit={handleSubmit(onSubmit)}
		>
      <div
				className="flex flex-col"
			>
				<input 
					{...register("zip", {
						required: false, 
						pattern: {
							value: /^\d{5}$/,
      				message: "Please enter valid ZIP or leave empty"
						}
					})}
					placeholder="All Locations"
					type="text"
					maxLength={5}
					inputMode="numeric"
					onInput={(e) => {
						//force only numeric input
						const target = e.target as HTMLInputElement
						target.value = target.value.replace(/\D/g, "")}
					}
				/>
				{/* errors will return when field validation fails  */}
				{errors.zip && <span>{errors.zip.message}</span>}
			</div>


      <input type="submit" />
    </form>
	)
}