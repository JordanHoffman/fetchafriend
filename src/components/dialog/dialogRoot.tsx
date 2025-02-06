"use client"

import { useStoreState } from "@/appState/store"
import { theme } from "@/theme"
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"

export const DialogRoot = () => {
	const dialogContent = useStoreState(s => s.dialogContent)
	const closeDialog = useStoreState(s => s.closeDialog)
	const dialogIsOpen = useStoreState(s => s.dialogIsOpen)
	return (
		<Dialog 
			open={dialogIsOpen}
			onClose={() => closeDialog()}
		>
			<DialogBackdrop className="fixed inset-0 bg-black/40" />
			{/* two following divs allow for scrollable dialog via Headless UI guide */}
			<div 
				className="fixed inset-0 overflow-y-auto p-4"
				onClick={closeDialog}
			>
				<div 
					className="flex min-h-full items-center justify-center"
					onClick={closeDialog}
				>
					<DialogPanel 
						className={`container rounded-3xl border-8 border-green-700 max-w-[600px] flex overflow-hidden container ${theme.bg}`}
					>
						{dialogContent}
					</DialogPanel>
				</div>
			</div>
		</Dialog>

	)
}