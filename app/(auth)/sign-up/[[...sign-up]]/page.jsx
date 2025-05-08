import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <style>{`
        .cl-internal-b3fm6y,
        .cl-internal-1p5x2kz {
          display: none !important;
        }
      `}</style>

      <SignUp forceRedirectUrl="/dashboard"/>
    </div>
  );
}
