type CandidateNameListItemProps = {
  className?: string;
  candidateName: string;
  onClick: () => void;
};

export default function CandidateNameListItem({
  className = '',
  candidateName,
  onClick,
}: CandidateNameListItemProps) {
  return (
    <li className={`px-2 py-1 ${className}`} onClick={onClick}>
      {candidateName}
    </li>
  );
}