type Props = {
	title: string
	subtitle?: string
}

export default function Title({ title, subtitle }: Props) {
	return (
		<div className="relative pb-5">
			<h1 className="font-bold text-2xl mb-1">{title}</h1>
			<p className="text-slate-500">{subtitle}</p>
			<div className="absolute h-[2px] w-14 bg-pink-700 bottom-0 left-0" />
		</div>
	)
}
