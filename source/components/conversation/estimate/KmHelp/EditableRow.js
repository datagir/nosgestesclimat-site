import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import { freqList, motifList } from './dataHelp'

export default function EditableRow({
	editFormData,
	setEditFormData,
	openmojiURL,
	handleEditFormSubmit,
}) {
	const handleEditFormChange = (event) => {
		event.preventDefault()

		const fieldName = event.target.getAttribute('name')
		const fieldValue = event.target.value

		const newFormData = { ...editFormData, [fieldName]: fieldValue }

		setEditFormData(newFormData)
	}

	const { t } = useTranslation()

	return (
		<tr
			css={`
				select,
				input {
					margin-bottom: 0rem;
					height: 2rem;
				}
			`}
		>
			<td>
				<select
					name="motif"
					className="ui__"
					value={editFormData.motif}
					onChange={handleEditFormChange}
				>
					{motifList(t).map((m) => (
						<option key={m.id} value={m.name}>
							{m.name}
						</option>
					))}
				</select>
			</td>
			<td>
				<input
					name="label"
					type="text"
					className="ui__"
					placeholder={t('Trajet (Optionnel)')}
					value={editFormData.label}
					onChange={handleEditFormChange}
				/>
			</td>
			<td>
				<NumberFormat
					name="distance"
					className="ui__"
					inputMode="decimal"
					allowNegative={false}
					required
					value={editFormData.distance}
					onChange={handleEditFormChange}
				/>
			</td>
			<td>
				<NumberFormat
					className="ui__"
					name="xfois"
					inputMode="decimal"
					allowNegative={false}
					value={editFormData.xfois}
					css={`
						max-width: 2rem !important;
					`}
					onChange={handleEditFormChange}
					required
				/>
				<strong> &nbsp; x / </strong>
				<select
					className="ui__"
					name="periode"
					value={editFormData.periode}
					onChange={handleEditFormChange}
					required
				>
					{freqList((s) => t(s, { ns: 'units' })).map((f) => (
						<option key={f.id} value={f.name}>
							{f.name}
						</option>
					))}
				</select>
			</td>
			<td>
				<NumberFormat
					id="peopleFieldinEditableRow"
					name="personnes"
					className="ui__"
					inputMode="decimal"
					allowNegative={false}
					required
					placeholder={t('Nombre de personnes')}
					value={editFormData.personnes}
					onChange={handleEditFormChange}
				/>
			</td>
			<td
				css={`
					> button {
						padding: 0.4rem;
					}
				`}
			>
				<button
					type="submit"
					form="tableTrajets"
					onClick={(e) => {
						handleEditFormSubmit(e)
					}}
				>
					<img src={openmojiURL('sauvegarder')} css="width: 1.7rem" />
				</button>
			</td>
		</tr>
	)
}
