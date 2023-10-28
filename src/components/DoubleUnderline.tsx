export type DoubleUnderlineProps = {};

const style = { height: 1, background: "#5A5252" };

export function DoubleUnderline(_: DoubleUnderlineProps) {
  return (
    <div className="w-full">
      <div className="w-full" style={{ ...style, marginBottom: 2 }} />
      <div className="w-full" style={style} />
    </div>
  );
}