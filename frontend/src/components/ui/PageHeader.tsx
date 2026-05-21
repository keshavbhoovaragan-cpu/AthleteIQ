interface PageHeaderProps {
  eyebrow: string;
  title: string;
  titleGradient?: string;
  subtitle: string;
}
const GRADIENTS: Record<string,string> = {
  blue:"linear-gradient(135deg,#60a5fa 0%,#a78bfa 100%)",
  warm:"linear-gradient(135deg,#fbbf24 0%,#f472b6 100%)",
  green:"linear-gradient(135deg,#34d399 0%,#60a5fa 100%)",
  red:"linear-gradient(135deg,#f87171 0%,#fb923c 100%)",
  purple:"linear-gradient(135deg,#a78bfa 0%,#f472b6 100%)",
  default:"linear-gradient(135deg,#60a5fa 0%,#a78bfa 50%,#f472b6 100%)",
};
const EYEBROW_COLORS: Record<string,string> = {
  blue:"rgba(96,165,250,0.6)",warm:"rgba(251,191,36,0.6)",
  green:"rgba(52,211,153,0.6)",red:"rgba(248,113,113,0.6)",
  purple:"rgba(167,139,250,0.6)",default:"rgba(96,165,250,0.6)",
};
export default function PageHeader({eyebrow,title,titleGradient="default",subtitle}:PageHeaderProps) {
  return (
    <div style={{marginBottom:32}}>
      <div style={{fontSize:10,color:EYEBROW_COLORS[titleGradient]||EYEBROW_COLORS.default,letterSpacing:"0.2em",fontWeight:700,marginBottom:8,textTransform:"uppercase"}}>{eyebrow}</div>
      <h1 style={{fontSize:36,fontWeight:900,lineHeight:1,letterSpacing:"-0.025em",marginBottom:8,background:GRADIENTS[titleGradient]||GRADIENTS.default,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{title}</h1>
      <p style={{color:"var(--text-muted)",fontSize:14,margin:0}}>{subtitle}</p>
    </div>
  );
}
