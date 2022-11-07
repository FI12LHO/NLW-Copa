import Image from 'next/image'
import avatares from '../assets/users-avatares.png'
import iconCheck from '../assets/icon-check.png'
import logo from '../assets/logo.svg';
import preview from '../assets/app-preview.png'
import { Api } from '../libs/api';
import { FormEvent, useState } from 'react';

interface HomeProp {
  poolsCount: number,
  guessesCount: number,
  usersCount: number
}

export default function Home(props:HomeProp) {
  const [poolName, setPoolName] = useState('')

  async function handleSubmit(e:FormEvent) {
    e.preventDefault();

    try {
      const res = await Api.post('pools', { title: poolName })
      const { code } = res.data
      
      await navigator.clipboard.writeText(code);
      alert(`Bolão cirado com sucesso, o código foi copiado para a área de transferência! Codigo: ${code}`)

      setPoolName('');
      
    } catch (error) {
      alert('Não foi possivel criar o bolão')
      console.error(error);

    }

    return
  }

  return (
    <div className='w-[90%] h-screen m-auto items-center justify-center flex flex-row gap-28'>
      <main>
        <Image src={logo} alt='NLW Copa' className='mt-4' />
        <h1 className='m-5 text-white text-5xl font-bold leading-tight'>Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>
        <div className='flex items-center gap-2'>
          <Image src={avatares} alt='Avatares' />
          <strong className='text-[#E1E1E6] text-xl'>
            <span className='text-[#129E57]'>+{ props.usersCount }</span> pessoas já estão usando
          </strong>
        </div>
        <form className='mt-2 flex gap-3' onSubmit={handleSubmit}>
          <input 
            type="text"
            onChange={ (e) => setPoolName(e.target.value) } 
            value={poolName} 
            placeholder='Qual nome do seu bolão?' 
            className='flex-1 px-6 py-4 rounded bg-[#202024] border-[#323238] border text-sm text-gray-100'
            />
          <button type="submit" className='bg-[#F7DD43] hover:bg-[#E5CD3D] text-gray-900 font-bold text-sm uppercase px-6 py-4 rounded'>Criar meu bolão</button>
        </form>
        <p className='text-[#8D8D99] text-sm mt-2 leading-relaxed'>Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀</p>
        <div className='mt-5 py-10 border-t border-t-gray-600 text-gray-100 flex justify-between items-center'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt=''/>
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{ props.poolsCount }</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className='h-14 w-px bg-gray-600'></div>
          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt=''/>
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{ props.guessesCount }</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image 
        src={preview} 
        alt='Previa da versão mobile' 
        quality={100}
        className='w-[40%] h-auto' />
    </div>
  )
}

export const getServerSideProps = async () => {
  const [poolsCount, guessesCount, usersCount] = await Promise.all([
    Api.get('pools/count'),
    Api.get('guesses/count'),
    Api.get('users/count')
  ]);

  return {
    props: {
      poolsCount: poolsCount.data.count,
      guessesCount: guessesCount.data.count,
      usersCount: usersCount.data.count
    }
  }
}