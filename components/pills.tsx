import styles from './pill.module.css'
export default function Pills(props: { pills: string[] }) {
	return (
		<>
			{props.pills.map((name: string, i: number) => (
				<a href={`/tag/${name}`} key={i}><span className={styles.pill}>{name}</span></a>
			))}
		</>
	);
}
