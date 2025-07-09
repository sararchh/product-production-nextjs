import { Production } from '@/modules/productions';
import productionsData from '../../data/productions.json';

export const productions: Production[] = [...productionsData] as Production[];
