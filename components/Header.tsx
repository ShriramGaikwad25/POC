import HeaderContent from './HeaderContent';

export function Header() {
  return (
    <header className="top-0 z-50 w-full" style={{ backgroundColor: '#DC143C' }}>
      <div className="flex h-[60px] px-6 items-center">
        {/* Main Header Content */}
        <HeaderContent />
      </div>
    </header>
  );
}
