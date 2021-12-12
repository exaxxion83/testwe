<?php
namespace App\Repository;

use App\Entity\Type;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class TypeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Type::class);
    }

    /**
     * @return array|Array
     */
    public function findAllOnlyName(): array
    {
        $entityManager = $this->getEntityManager();

        $result = $entityManager->createQuery(
            'SELECT T
            FROM App\Entity\Type T'
        )->getResult();

        return $this->getOnlyName($result);
    }

    /**
     * @param array $array
     * @return Array
     */
    private function getOnlyName(Array $array): Array
    {
        $result = [];

        foreach($array as $type) {
            $name = $type->getName();
            if ($name) {
                $result[$type->getId()] = $name;
            }
        }

        return $result;
    }
}