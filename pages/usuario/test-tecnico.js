import Head from 'next/head';
import LayoutTest from '../../componentes/LayoutTest';
import Cuestionario from '../../componentes/Cuestionario';

export default function TestTecnico() {
  return (
    <>
      <Head>
        <title>AcreditaTech - Test Técnico</title>
      </Head>
      <LayoutTest>
        <Cuestionario tipo={1} />
      </LayoutTest>
    </>
  );
}