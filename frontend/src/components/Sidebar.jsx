import {
  DocumentTextIcon,
  DocumentDuplicateIcon,
  ScissorsIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  {
    name: 'PDF Tools',
    icon: DocumentTextIcon,
    children: [
      { name: 'PDF Studio', href: '/pdf', icon: DocumentTextIcon },
      { name: 'Compressor', href: '/pdf/compress', icon: ArrowsUpDownIcon },
      { name: 'Merger', href: '/pdf/merge', icon: DocumentDuplicateIcon },
      { name: 'Splitter', href: '/pdf/split', icon: ScissorsIcon },
      { name: 'Editor', href: '/pdf/editor', icon: PencilIcon },
      { name: 'OCR', href: '/pdf/ocr', icon: MagnifyingGlassIcon },
    ],
  },
]; 