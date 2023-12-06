import styles from './web-ui.module.css';

/* eslint-disable-next-line */
export interface WebUiProps {}

export function WebUi(props: WebUiProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to WebUi!</h1>
    </div>
  );
}

export default WebUi;
